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
    // localStorage: new Store("backbone-todo")
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
    template: Handlebars.compile($("#todo-item-template").html()),
    render: function() {
        this.$el.html(this.template(this.model.toJSON()))
        return this.$el;
    }
});
app.Views.TodoItems = Backbone.View.extend({
    el: ".todo-items",
    initialize: function() {
        // this.listenTo(this.collection, "add", );
        // this.listenTo(this.collection, "remove", );

        // app.todoItems.fetch();
        this.render();
    },
    render: function() {
        this.$el.html('');  // clear children
        
        let todoViews = this.collection.map(todoItem => {
            return (new app.Views.TodoItem({model: todoItem})).render();
        });
        this.$el.append(todoViews);

        return this.$el;
    }
});

app.todoItems = new app.Collections.TodoItems([
    {title: "AAA"},
    {title: "BBB"},
    {title: "CCC"}
]);

app.todoAppView = new app.Views.TodoApp();
app.todoItemsView = new app.Views.TodoItems({collection: app.todoItems});