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
    template: Handlebars.compile($("#todo-app-template").html()),    
    initialize: function() {
        
        const todoItemsCollection = new app.Collections.TodoItems([
            {title: "AAA"},
            {title: "BBB"},
            {title: "CCC"}
        ]);
        this.subviews = {
            todoListView: new app.Views.ToDoListView({collection: todoItemsCollection})
        };

        this.render();
    },
    render: function() {
        console.log("rendering app view");

        this.$el.html(this.template());

        this.todoContent = this.$(".js-todo-content");
        this.newTodoField = this.$(".js-new-todo");
        this.markAllCompleteField = this.$(".mark-all-complete");

        this.todoContent.append(this.subviews.todoListView.render());

        return this.$el;
    }
});
app.Views.ToDoItemView = Backbone.View.extend({
    tagName: "li",
    className: "todo-item",
    template: Handlebars.compile($("#todo-item-template").html()),
    render: function() {
        console.log("rendering item view: ", this.model);

        this.$el.html(this.template(this.model.toJSON()))
        return this.$el;
    }
});
app.Views.ToDoListView = Backbone.View.extend({
    tagName: "ul",
    className: ".todo-items",
    initialize: function() {
        // this.listenTo(this.collection, "add", );
        // this.listenTo(this.collection, "remove", );

        // app.todoItems.fetch();
        this.subviews = {
            todoItems: []
        };
    },
    render: function() {
        console.log("rendering list view: ", this.collection);

        this.removeSubviews();
        
        this.collection.forEach(todoItem => {
            const view = new app.Views.ToDoItemView({model: todoItem});
            this.subviews.todoItems.push(view);
            this.$el.append(view.render());
        });

        return this.$el;
    },
    removeSubviews: function() {
        this.subviews.todoItems.forEach(subview => {
            subview.remove();
        });
        this.subviews.todoItems = [];
    }
});

app.todoAppView = new app.Views.TodoAppView();
