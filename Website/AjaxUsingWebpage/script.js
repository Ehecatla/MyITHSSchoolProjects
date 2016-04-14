$(document).ready(function(){

    var $buttonDiv = $('.menu');
    var $menuButton = $('.menu button');
    var key = '?key=32c1f579-9f3c-4d3f-bb5a-062a63b2c9fc';
    var urlAdress = 'https://iths.bbweb.se/articles';
    var $lastUsedButton; 
    
    //default article object placeholders
    var noArticleObject = {title: 'Current article',author:'', date:'',text:'No article selected'};
    var loadArticleObject = {title: 'No article',author:'Author: ', date:'Date:',text:'Loading...'};
    var errorArticleObject = {title: 'Error',author:'', date:'',text:'Page could not load'};
       
    //object configured for download of 1 object, sets up article 
    var oneArticleSettings = {
        type: 'GET',
        success: function(data){
            var jsonObj = data; 
            var jsonString = JSON.stringify(jsonObj);            
            var articleObj = $.parseJSON(jsonString); 
                        
            setArticle(articleObj);   
        },
        dataType: 'json',
        error: function(){
            console.log('Something went wrong, no article found');
            showDefaultPage(errorArticleObject);           
        }
    };
    

    //object configured for ajax download of all articles
    var articlesSettings = {
        type: 'GET',
        success: function(data){           
            console.log('Articles downloaded with success.'); 
            for(var id in data){
                var jsonObj = data[id]; 
                var jsonString = JSON.stringify(jsonObj);            
                var articleObj = $.parseJSON(jsonString); //var articleObj = JSON.parse(jsonString);                 
             
                var button = '<button>'+ articleObj.title + '</button>';
                var $button = $(button);
                $buttonDiv.append($button);            
                $button.on('click', buttonClosure(articleObj._id));                 
            }      
        },
        dataType: 'json',
        error: function(){
            console.log('Something went wrong, no articles were downloaded:( ');
            showDefaultPage(errorArticleObject);
        }        
    };
    
    
    // used to encapsulate which article is to be shown by button, returns function to be used in listener
    var buttonClosure = function(articleId){
        return function (event){           
             updateUsedButtonLook($(this));
            if(articleId){
                var attribute = '/'+articleId;
                var  searchPhrase = urlAdress + attribute + key;
                showDefaultPage(loadArticleObject);
                $.ajax(searchPhrase, oneArticleSettings); 
            } else {
                 showDefaultPage();               
            }   
        };
    };
    
        
    /**
     * Function showDefaultPage takes article object as argument and displays it.
     * This function is used to display default loading, error and no article pages
     * which arent downloaded from server.
     */
    function showDefaultPage(defaultArticleObj){
        cleanArticleFields();
        if(defaultArticleObj) {         
            $('.title').append('<span>' + defaultArticleObj.title + '</span>' );
            $('.author').append( defaultArticleObj.author );
            $('.date').append( defaultArticleObj.date );
            $('.text').append( defaultArticleObj.text );
        } else {
            $('.title').text(noArticleObject.title);
            $('.text').text( noArticleObject.text );      
        }
    }
    
    
   /**Function cleanArticleFields removes all data from fields corresponding to
    * showing article information on website.
    */
    function cleanArticleFields(){
        $('.title span').text( '' );   
        $('.author span').text( '' );
        $('.date span').text( '' );
        
        $('.text').text( '' );
        $('.title').text( '' );
        $('.author').text( '' );
        $('.date').text( '' );
    }
    
  
    /**
     * Function removeArticle takes article id as argument and runs ajax remove
     * call to remove article with that id from server. If article was removed
     * with success then even button corresponding to it is removed from website
     * and page is moved to show default no article view.
     */
    function removeArticle(articleId){
        var articleUrl = urlAdress + '/' + articleId + key;
        $.ajax(articleUrl, {
            type: 'DELETE',
            success: function(){     
                /*Set actual page to default first page, remove button for removed article. */
                $lastUsedButton.remove();
                showDefaultPage();
                updateUsedButtonLook($('.menu button:first-child'));    
                //window.location.reload(); //alternative, just reload website instead    
            },
            error: function(){console.log('Error: could not remove article');}
        });
    }    
     
        
    /**
     * Function setArticle uses article object argument by displaying its data contained in
     * properties author, date, title and text. It uses properties authorEmail and _id to
     * respective show email and allow removal of article from server by adding remove button.
     */
    function setArticle(article){
        cleanArticleFields();        
        
        if(article){
            $('.author').text('Author: ');
            $('.date').text('Date: ');          
            $('.title').append('<span>' + article.title + '</span>' );
            var authorWithLink = '<span> <a href=\'mailto:'
                                        + article.authorEmail 
                                        + '\'>' + article.author 
                                        +'</a></span>';
                                        
            $('.author').append(authorWithLink);
            $('.date').append('<span>' + article.date + '</span>' );         
            $('.text').append( article.text );
            $('.text').append( '<p> <button>Remove article</button></p>' );
            $('.article-view button').on('click', function(){
                removeArticle(article._id);
            });
            
        } else {
           showDefaultPage(errorArticleObject);   
       }
    };  
    
    
    /**
     * Function updateUsedButtonLook assigns bold look to button given in 
     * argument and changes previous used buttons look to normal font weight.
     * Button given in argument is then assigned to be latest used button.
     */
    function updateUsedButtonLook($nowActiveButton){
        if($lastUsedButton !== undefined){
            $lastUsedButton.css('font-weight', 'normal'); 
        } 
        $nowActiveButton.css('font-weight', 'bold');
        $lastUsedButton = $nowActiveButton;
    }
    
    
    //start up setup
    showDefaultPage();      
    updateUsedButtonLook($('.menu button:first-child'));
    
    $menuButton.on('click', buttonClosure());
    $.ajax((urlAdress+key), articlesSettings);
 
    
});


