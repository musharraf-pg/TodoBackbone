var app = {
    Models: {},
    Collections: {},
    Views: {}
};

app.Models.TodoItem = Backbone.Model.extend({
    defaults: {
        // title: "",
        completed: false
    }
});

app.Collections.TodoItems = Backbone.Collection.extend({
    model: app.Models.TodoItem,
    localStorage: new Store("backbone-todo")
})

app.Views.TodoApp = Backbone.View.extend({
    el: ".todo",
    initialize: function() {
        this.newTodoField = this.$(".todo__new-todo-field");
        this.markAllCompleteField = this.$(".mark-all-complete");
        this.totalCount = this.$(".total-count");
        this.remainingCount = this.$(".remaining-count");
        this.completeCount = this.$(".complete-count");
    }
});
app.Views.TodoItem = Backbone.View.extend({
    tagName: "li",
    className: "todo-item",
    // template: _.template(...),
    render: function() {

    }
});
app.Views.TodoItems = Backbone.View.extend({
    el: ".todo-items",
    initialize: function() {
        // this.listenTo(this.collection, "add", );
        // this.listenTo(this.collection, "remove", );

        app.todoItems.fetch();        
    }
});

app.todoItems = new app.Collections.TodoItems();

app.todoAppView = new app.Views.TodoApp();
app.todoItemsView = new app.Views.TodoItems({collection: app.todoItems});