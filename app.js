var app = {
    Models: {},
    Collections: {},
    Views: {}
};

app.Models.TodoItem = Backbone.Model.extend({
    defaults: {
        title: undefined,
        completed: false
    }
});

app.Collections.TodoItems = Backbone.Collection.extend({
    model: app.Models.TodoItem,
    // localStorage: new Store("backbone-todo")
});

app.Views.TodoAppView = Backbone.View.extend({
    el: ".todo",
    initialize: function() {
        
        const todoItemsCollection = new app.Collections.TodoItems([
            {title: "AAA"},
            {title: "BBB"},
            {title: "CCC"}
        ]);
        this.todoListView = new app.Views.ToDoListView({collection: todoItemsCollection});
        this.subviews = [this.todoListView];

        this.render();
    },
    events: {
        "keypress .js-new-todo": "createTodoOnEnter"
    },
    template: Handlebars.compile($("#todo-app-template").html()),
    render: function() {
        console.log("rendering app view");

        this.$el.html(this.template());

        this.todoContent = this.$(".js-todo-content");
        this.newTodoField = this.$(".js-new-todo");
        this.markAllCompleteField = this.$(".mark-all-complete");

        this.todoContent.append(this.todoListView.render());

        return this.$el;
    },
    createTodoOnEnter: function(e) {
        const title = this.newTodoField.val().trim();
        if (e.which == 13 && title != "") {

            this.todoListView.collection.add(new app.Models.TodoItem({
                title: title
            }));
        }
    }
});
app.Views.ToDoItemView = Backbone.View.extend({
    tagName: "li",
    className: "todo-item",
    events: {
        "click .js-delete-btn": "delete"
    },
    template: Handlebars.compile($("#todo-item-template").html()),
    render: function() {
        console.log("rendering item view: ", this.model);

        this.$el.html(this.template(this.model.toJSON()))
        return this.$el;
    },
    delete: function() {
        this.model.destroy();
    }
});
app.Views.ToDoListView = Backbone.View.extend({
    tagName: "ul",
    className: ".todo-items",
    initialize: function() {
        this.listenTo(this.collection, "add", this.render);
        this.listenTo(this.collection, "remove", this.render);

        // app.todoItems.fetch();
        this.subviews = [];
    },
    render: function() {
        console.log("rendering list view: ", this.collection);

        this.empty();
        
        this.collection.forEach(todoItem => {
            const view = new app.Views.ToDoItemView({model: todoItem});
            this.subviews.push(view);
            this.$el.append(view.render());
        });

        return this.$el;
    },
    empty: function() {
        this.subviews.forEach(subview => {
            subview.remove();
        });
        this.subviews = [];
    }
});

app.todoAppView = new app.Views.TodoAppView();
