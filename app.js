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
})

app.Views.TodoAppView = Backbone.View.extend({
    el: ".todo",
    initialize: function() {
        
        const todoItemsCollection = new app.Collections.TodoItems([
            {title: "AAA"},
            {title: "BBB"},
            {title: "CCC"}
        ]);
        const todoListView = new app.Views.ToDoListView({collection: todoItemsCollection});
        this.subviews = [todoListView];

        this.render();
    },
    template: Handlebars.compile($("#todo-app-template").html()),
    render: function() {
        console.log("rendering app view");

        this.$el.html(this.template());

        this.todoContent = this.$(".js-todo-content");
        this.newTodoField = this.$(".js-new-todo");
        this.markAllCompleteField = this.$(".mark-all-complete");
        this.totalCount = this.$(".total-count");
        this.remainingCount = this.$(".remaining-count");
        this.completeCount = this.$(".complete-count");

        this.todoContent.append(this.subviews[0].render());

        return this.$el;
    },

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
        this.subviews = [];
    },
    render: function() {
        console.log("rendering list view: ", this.collection);

        this.empty();
         
        const todoItemViews = this.collection.map(todoItem => {
            const todoItemView = new app.Views.ToDoItemView({model: todoItem});
            return todoItemView.render();
        });
        this.$el.append(todoItemViews);

        return this.$el;
    },
    empty: function() {
        this.subviews.forEach(subview => {
            subview.remove();
        });
    }
});

app.todoAppView = new app.Views.TodoAppView();
