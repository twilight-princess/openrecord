var should = require('should');

var Store = require('../../lib/store');

describe('Relations', function(){
  
  describe('hasMany()', function(){
    var store = new Store();

    store.Model('User', function(){
      this.attribute('login', String); 
      this.hasMany('posts');
    });
    
    store.Model('Post', function(){
      this.attribute('title', String); 
    });
  
    var User = store.Model('User');
    var Post = store.Model('Post');
    var phil = new User({login:'phil', posts:[{
      title:'Title A'}, 
      {title:'Title B', invalid_attribute:'test'}
    ]});
    
    
    it('posts exist', function(){
      should.exist(phil.posts);
    });
    
    it('posts is an Array', function(){
      phil.posts.should.be.an.instanceof(Array);
    });
    
    it('posts has Model methods', function(){
      phil.posts.new.should.be.a.Function;
      phil.posts.chain.should.be.a.Function;
    });
    
    it('posts should be a chained Model', function(){
      phil.posts.should.not.be.equal(Post);
      phil.posts.should.be.equal(phil.posts.chain());
    });
    
        
    it('posts is an array of Post Records', function(){
      phil.posts[0].should.have.property('title');
      phil.posts[1].title.should.be.equal('Title B');
      should.not.exist(phil.posts[1].invalid_attribute);      
    });
            
  });
  
  
  
  
  
  
  describe('belongsTo()', function(){
    var store = new Store();

    store.Model('User', function(){
      this.attribute('login', String); 
    });
    
    store.Model('Post', function(){
      this.attribute('title', String); 
      this.belongsTo('user');
    });
  
    var User = store.Model('User');
    var Post = store.Model('Post');
    var post = new Post({
      title:'title A', 
      user: {login:'phil'}
    });
    
    
    it('user exist', function(){
      should.exist(post.user);
    });
    
    it('user is a Record', function(){
      post.user.should.be.an.instanceof(User);
    });
    
    it('user has Record methods', function(){
      post.user.isValid.should.be.a.Function;
      post.user.validate.should.be.a.Function;
    });
        
        
    it('user has the right attributes', function(){
      post.user.should.have.property('login');
      post.user.login.should.be.equal('phil');
    });
    
    
    it('assignment of a hash creates a new model', function(){
      post.user = {login:'admin', unknown_attr: 'test'};

      post.user.login.should.be.equal('admin');
      should.not.exist(post.user.unknown_attr);
    });
    
    
    it('assignment of a record works', function(){
      var user = new User({login:'admin'});

      post.user = user;

      post.user.login.should.be.equal('admin');
      post.user.should.be.equal(user);
    });
            
  });
  
});