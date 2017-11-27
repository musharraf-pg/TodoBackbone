var app = {
    Models: {},
    Collections: {},
    Views: {}
};

app.Models.TodoItem = Backbone.Model.extend({
    defaults: {
        title: undefined,
        completed: false,
        editing: false
    }
});

app.Collections.TodoItems = Backbone.Collection.extend({
    model: app.Models.TodoItem,
});

app.Views.TodoAppView = Backbone.View.extend({
    el: ".todo",
    template: Handlebars.compile($("#todo-app-template").html()),
    events: {
        "keypress .js-new-todo": "createTodoOnEnter"
    },
    initialize: function () {
        const todoItemsCollection = new app.Collections.TodoItems([
            { title: "AAA" },
            { title: "BBB" },
            { title: "CCC" }
        ]);
        this.subviews = {
            todoListView: new app.Views.ToDoListView({ collection: todoItemsCollection })
        };

        this.render();
    },
    render: function () {
        console.log("rendering app view");

        this.$el.html(this.template());

        this.todoContent = this.$(".js-todo-content");
        this.newTodoField = this.$(".js-new-todo");
        this.markAllCompleteField = this.$(".mark-all-complete");

        this.todoContent.append(this.subviews.todoListView.render());

        return this.$el;
    },
    createTodoOnEnter: function (event) {
        const title = this.newTodoField.val().trim();
        if (event.which === 13 && title !== "") {
            this.subviews.todoListView.collection.add(new app.Models.TodoItem({
                title
            }));
        }
    }
});
app.Views.ToDoItemView = Backbone.View.extend({
    tagName: "li",
    className: "todo-item",
    template: Handlebars.compile($("#todo-item-template").html()),
    events: {
        "click .js-delete-btn": "delete",
        "dblclick .js-item-label": "startEditing",
        "blur .js-edit-input": "finishEditing",
        "keypress .js-edit-input": "finishEditingOnEnter",
        "change .js-complete-checkbox": "updateCompleted"
    },
    initialize: function () {
        this.listenTo(this.model, "change", this.render);
    },
    render: function () {
        console.log("rendering item view: ", this.model);

        this.$el.html(this.template(this.model.toJSON()))

        this.editInput = this.$(".js-edit-input");
        this.completeCheckbox = this.$(".js-complete-checkbox");

        return this.$el;
    },
    delete: function () {
        this.model.destroy();
    },
    startEditing: function () {
        this.model.set('editing', true);
    },
    finishEditingOnEnter: function (event) {
        if (event.which === 13) {
            this.finishEditing();
        }
    },
    finishEditing: function () {
        this.model.set({
            title: this.editInput.val().trim()
        })
        this.model.set('editing', false);
    },
    updateCompleted: function () {
        this.model.set({
            completed: this.completeCheckbox.prop("checked")
        });
    }
});
app.Views.ToDoListView = Backbone.View.extend({
    tagName: "ul",
    className: ".todo-items",
    initialize: function () {
        this.listenTo(this.collection, "add remove", this.render);

        this.subviews = {
            todoItems: []
        };
    },
    render: function () {
        console.log("rendering list view: ", this.collection);

        this.removeSubviews();

        this.collection.forEach(todoItem => {
            const view = new app.Views.ToDoItemView({ model: todoItem });
            this.subviews.todoItems.push(view);
            this.$el.append(view.render());
        });

        return this.$el;
    },
    removeSubviews: function () {
        this.subviews.todoItems.forEach(subview => {
            subview.remove();
        });
        this.subviews.todoItems = [];
    }
});

app.todoAppView = new app.Views.TodoAppView();
