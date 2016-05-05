$(function () {
    var APPLICATION_ID = "182862E1-C032-3E32-FF3B-252C64A2B800",
            SECRET_KEY = "52CC6E78-14FD-9EF5-FF33-E8FA23D39600",
            VERSION = "v1";

    Backendless.initApp(APPLICATION_ID, SECRET_KEY, VERSION);

    if (Backendless.UserService.isValidLogin()) {
        userLoggedIn(Backendless.LocalCache.get("current-user-id"));
    } else {
        console.log("Not valid login");
        var loginScript = $("#login-template").html();
        var loginTemplate = Handlebars.compile(loginScript);

        $('.main-container').html(loginTemplate);

    };
    
    $(document).on('submit', '.form-signin', function (event) {
        event.preventDefault();
        console.log("Form submitted");
        var data = $(this).serializeArray(),
                email = data[0].value,
                password = data[1].value;
 

       Backendless.UserService.login(email, password, true, new Backendless.Async(userLoggedIn, gotError));
    });

    $(document).on('click', '.add-blog', function () {
        var addBlogScript = $("#add-blog-template").html();
        var addBlogTemplate = Handlebars.compile(addBlogScript);

        $('.main-container').html(addBlogTemplate);
        tinymce.init({seletor: 'textarea'});
    });

    $(document).on('click', '.form-add-blog', function (event) {
        event.preventDefault();

        var data = $(this).serializeArray(),
                title = data[0].value,
                content = data[1].value;

        if (content === "" || title === "") {
            Materialize.toast('Empty Title or Empty  Statement', 4000);

        }
        else {
            var dataStore = Backendless.Persistence.of(Posts);

            var postObject = new Posts({
                title: title,
                content: content,
                authorEmail: Backendless.UserService.getCurrentUser().email
            });

            dataStore.save(postObject);

            this.title.value = "";
            this.content.value = "";

        }
    });
    $(document).on('click', '.logout', function () {
        Backendless.UserService.logout(new Backendless.Async(userLoggedOut, gotError));

        var loginScript = $("#login-template").html();
        var loginTemplate = Handlebars.compile(loginScript);

        $('.main-container').html(loginTemplate);
    });
});
function Posts(args) {
    args = args || "";
    this.title = args.title || "";
    this.content = args.content || "";
    this.authorEmail = args.authorEmail || "";
}

function userLoggedIn(user) {
    console.log("user successfully logged in");
    var userData;
    if (typeof user === "string") {
        userData = Backendless.Data.of(Backendless.User).findById(user);
    } else {
        userData = user;
    }

    if (typeof user == "string") {
        userData = Backendless.Data.of(Backendless.User).findById(user);
    } else {
        userData = user;
    }
    var welcomeScript = $('#welcome-template').html();
    var welcomeTemplate = Handlebars.compile(welcomeScript);
    var welcomeHTML = welcomeTemplate(userData);

    $('.main-container').html(welcomeHTML);
}

function userLoggedOut() {
    console.log("successfully logged out");
}

function gotError(error) {
    Materialize.toast('You Got It Wrong', 3000, 'rounded');
    console.log("Error message - " + error.message);
    console.log("Error code - " + error.code);
}

