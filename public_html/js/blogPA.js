/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global Backendless, Handlebars, moment */

$(function () {
    var APPLICATION_ID = "182862E1-C032-3E32-FF3B-252C64A2B800",
        SECRET_KEY = "52CC6E78-14FD-9EF5-FF33-E8FA23D39600",
        VERSION = "v1";
        
         
    Backendless.initApp(APPLICATION_ID, SECRET_KEY, VERSION);
   
    
    var postsCollection = Backendless.Persistence.of(Posts).find();
    
    console.log(postsCollection);
    
    var wrapper = {
        posts: postsCollection.data
    };
    
    Handlebars.registerHelper('format', function(time){
        return moment(time).format("dddd, MMMM Do YYYY");
    });
    
    var blogScript = $("#blogs-template").html();
    var blogTemplate = Handlebars.compile(blogScript);
    var blogHTML = blogTemplate(wrapper);
    
    $('.main-container').html(blogHTML);
    
    $(document).on('click') , ''
});

function Posts(args){
    args = args || {};
    this.title = args.title || "";
    this.content = args.content || "";
    this.authorEmail = args.authorEmail || "";
}