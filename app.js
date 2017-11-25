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
    initialize: function() {
        // this.listenTo(this.model, "destroy", this.remove);  // is this needed even though list view already listens for remove
        this.listenTo(this.model, "change", this.render);
    },
    events: {
        "click .js-delete-btn": "delete",
        "dblclick .js-item-label": "startEditing",
        "blur .js-edit-input": "finishEditing",        
        "keypress .js-edit-input": "finishEditingOnEnter",
        "change .js-complete-checkbox": "updateCompleted"
    },
    template: Handlebars.compile($("#todo-item-template").html()),
    render: function() {
        console.log("rendering item view: ", this.model);

        this.$el.html(this.template(this.model.toJSON()))

        this.editInput = this.$(".js-edit-input");
        this.completeCheckbox = this.$(".js-complete-checkbox");

        return this.$el;
    },
    delete: function() {
        this.model.destroy();
    },
    startEditing: function() {
        this.editInput.val(this.model.get("title"));
        this.$el.addClass("editing");
        this.editInput.focus();
    },
    finishEditingOnEnter: function(e) {
        if (e.which == 13) {
            this.finishEditing();
        }
    },
    finishEditing: function() {
        this.model.set({
            title: this.editInput.val().trim()
        })

        this.$el.removeClass("editing");
    },
    updateCompleted: function() {
        this.model.set({
            completed: this.completeCheckbox.prop("checked")
        });
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
