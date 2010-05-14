/*
---

script: NivooSlider.js

description: A nice image slider for MooTools.

license: MIT-style license

authors:
- Johannes Fischer

requires:
- core/1.2.4: '*'

provides:
- NivooSlider

...
 */

var NivooSlider = new Class({

    Implements: [Events,Options],

    caption: null,
	children: null,
    containerSize: 0,
	count: 0,
    currentSlide: 0,
    currentImage: '',
    effects: {
		horizontal: ['fade', 'fold', 'sliceLeftUp', 'sliceLeftDown' , 'sliceLeftRightDown', 'sliceLeftRightUp', 'sliceRightDown', 'sliceRightUp'],
		vertical: ['fade','fold','sliceDownLeft','sliceDownRight','sliceUpDownLeft','sliceUpDownRight','sliceUpLeft','sliceUpRight']
	},
	hover: false,
	interval: null,
    paused: false,
    running: false,
    totalSlides: 0,

    options: {
        animSpeed: 500,
        autoPlay: true,
        effect:'sliceDown',
		interval: 3000,
		orientation: 'vertical',
		pauseOnHover: true,
		slices: 15,
        
		// not implemented yet
        directionNav: true,
        directionNavHide: true,
        controlNav: true

        //onStart: $empty(),
        //onFinish: $empty()
    },
    
    initialize: function(container, options)
    {
        this.container = $(container);
        this.setOptions(options);
        
        this.initSlider();
        this.createSlices();
        if(this.options.autoPlay)
        {
            this.play();
        }
    },
    
    /**
     * Getter
     */
    
	getImages: function()
	{
		return this.container.getElements('img');	
	},
	
    getSlices: function()
    {
        return this.container.getElements('.nivoo-slice');    
    },
    
	/**
	 * Setter
	 */
	
	setBackgroundImage: function()
	{
		this.container.setStyle('background-image','url('+this.currentImage.get('src') +')');	
	},
	
	setCaptionText: function(text)
	{
		this.caption.set('text', text);
	},
	
	/**
	 * Create
	 */
	
    initSlider: function()
    {
		this.container.addClass('nivooSlider');

        this.containerSize = this.container.getSize();
        
        // Find our slider children
        this.children = this.getImages();

        this.totalSlides = this.children.length;

        this.children.setStyle('display','none');

        this.currentImage = this.children[0];
		
		// init LinkHolder
		this.createLinkHolder();

        // Set first background
		this.container.setStyle('background-image', 'url('+this.currentImage.get('src')+')');

		this.createCaption();

		this.showCaption();
		
		// attach pauseOnHover		
		if(this.options.pauseOnHover && this.options.autoPlay)
		{
			this.container.addEvents({
				'mouseenter': this.pause.bindWithEvent(this),
				'mouseleave': this.play.bindWithEvent(this)
			});
		}
    },
	
	createCaption: function()
	{
		this.caption = new Element('p', {
			'class': 'nivoo-caption',
			styles: {
				opacity: 0
			}
		}).inject(this.container);
		
		this.caption.store('fxInstance', new Fx.Morph(this.caption, {
			duration: 200,
			wait: false
		}));
		this.caption.store('height', this.caption.getHeight());
	},
    
	createLinkHolder: function()
	{
		this.linkHolder = new Element('a', {
			'class': 'nivoo-link',
			href: '#'
		}).inject(this.container);
	},
	
    createSlices: function()
    {
		var sliceSize = {
			x: (this.container.getWidth()/this.options.slices).round(),
			y: (this.container.getHeight()/this.options.slices).round()
		};

        this.options.slices.each(function(i){

            var slice = new Element('div', {
                'class': 'nivoo-slice'
            }).inject(this.container);

			var position = {
				left: this.options.orientation == 'vertical' ? sliceSize.x*i : 0,
				top: this.options.orientation == 'horizontal' ? sliceSize.y*i : 0
			};

			// set size & position
			if(this.options.orientation == 'horizontal')
			{
				slice.setStyles({
					height: i == this.options.slices-1 ? this.container.getHeight()-(sliceSize.y*i) : sliceSize.y,
                    top: position.top,
                    width: '100%'
                });
			}
			// if vertical
			else
			{
				slice.setStyles({
					left: position.left,
                    width: i == this.options.slices-1 ? this.container.getWidth()-(sliceSize.x*i) : sliceSize.x
                });
			}
            slice.store('fxInstance', new Fx.Morph(slice, {
                duration: this.options.animSpeed
            })).store('position', position);
        }, this);
    },
    
	/**
	 * Caption
	 */
	
	hideCaption:function()
	{
		var fx = this.caption.retrieve('fxInstance');

		fx.start({
			bottom: this.caption.retrieve('height') * -1,
			opacity: 0	
		});
	},
	
	showCaption: function()
	{
		var title = this.currentImage.get('title');
		
		if(!title){
			return;
		}
		
		this.setCaptionText(title);

		var fx = this.caption.retrieve('fxInstance');
		fx.start({
			bottom: 0,
			opacity: 1	
		});
	},
	
	/**
	 * Slide / Animations
	 */

	play: function()
	{
		this.interval = this.slide.periodical(this.options.interval, this);
	},

	pause: function()
	{
		$clear(this.interval);
	},
	
    slide: function()
    {
		if(this.running)
		{
			return;
		}

        // Set current background before change
        this.setBackgroundImage();

        this.currentSlide++;
        if(this.currentSlide == this.totalSlides) this.currentSlide = 0;
        if(this.currentSlide < 0) this.currentSlide = (this.totalSlides - 1);

        // Set currentImage
        this.currentImage = this.children[this.currentSlide];

        //Set active link
		var imageParent = this.currentImage.getParent();

        if(imageParent.get('tag') == 'a')
		{
			this.linkHolder.setStyle('display', 'block').set('href', imageParent.get('href'));
		}
		else
		{
			this.linkHolder.setStyle('display', 'none');
		}

        // Process caption		
		this.hideCaption();
		this.showCaption();

        var slices = this.getSlices();
		var timeBuff = 0;

		//Set new slice backgrounds
		var orientation = this.options.orientation;
		
        slices.each(function(slice, i){
			var position =  slice.retrieve('position');

            slice.setStyles({
                background: 'url('+this.currentImage.get('src')+') no-repeat -'+ position.left +'px '+ position.top*-1 +'px',
                opacity: 0
            });
			
			var property = orientation == 'horizontal' ? 'width' : 'height';

			slice.setStyle(property, 0);
			
        }, this);
    
		// fire onStart function
        this.start();
	
        // Run effects
        this.running = true;

		var effect = this.options.effect;

		if(effect == 'random')
        {
            effect = this.effects[orientation].getRandom();
        }

		// vertical effects
        if(['sliceDownRight', 'sliceDownLeft'].contains(effect))
        {
            if(effect == 'sliceDownLeft')
            {
                slices = slices.reverse();
            }

            slices.each(function(slice, i){
                slice.setStyle('top', 0);

                this.animate.delay(100 + timeBuff, this, [slice, 'height', this.containerSize.y]);

                timeBuff+= 50;
            }, this);
        }
        else if(['sliceUpRight', 'sliceUpLeft'].contains(effect))
        {
            if(effect == 'sliceUpLeft')
            {
                slices = slices.reverse();
            }

            slices.each(function(slice, i){
                var fx = slice.retrieve('fxInstance');
                
                slice.setStyle('bottom', 0);

                this.animate.delay(100 + timeBuff, this, [slice, 'height', this.containerSize.y]);

                timeBuff+= 50;
            }, this);
        }
        else if(['sliceUpDownRight', 'sliceUpDownLeft'].contains(effect))
        {
            if(effect == 'sliceUpDownLeft')
            {
                slices = slices.reverse();
            }

            slices.each(function(slice, i){
                if(i%2 == 0)
                {
                    slice.setStyle('top', 0);
                }
                else
                {
                    slice.setStyle('bottom', 0);
                }

                this.animate.delay(100 + timeBuff, this, [slice, 'height', this.containerSize.y]);

                timeBuff+= 50;
            }, this);
        }

		// horizontal effects		
		else if(['sliceLeftUp', 'sliceLeftDown' , 'sliceRightDown', 'sliceRightUp'].contains(effect))
		{
			if(effect == 'sliceLeftUp' || effect == 'sliceRightUp')
            {
                slices = slices.reverse();
            }
			
			if(effect == 'sliceRightDown' || effect == 'sliceRightUp')
			{
				slices.setStyle('right', 0);
			}
			else
			{
				slices.setStyle('left', 0);
			}

            slices.each(function(slice, i){    
                this.animate.delay(100 + timeBuff, this, [slice, 'width', this.containerSize.x]);

                timeBuff+= 50;
            }, this);
		}
		else if(['sliceLeftRightDown', 'sliceLeftRightUp'].contains(effect))
        {
            if(effect == 'sliceLeftRightUp')
            {
                slices = slices.reverse();
            }

            slices.each(function(slice, i){
                if(i%2 == 0)
                {
                    slice.setStyle('left', 0);
                }
                else
                {
                    slice.setStyle('right', 0);
                }

                this.animate.delay(100 + timeBuff, this, [slice, 'width', this.containerSize.x]);

                timeBuff+= 50;
            }, this);
        }

		// horizontal or vertical		
        else if(effect == 'fold')
        {
            slices.each(function(slice, i){
				if(orientation == 'horizontal')
				{
					var property = 'height';
					var to = slice.getHeight();
	
					slice.setStyles({
						height: 0,
						width: this.containerSize.x
					});
				}
				else
				{
					var property = 'width';
					var to = slice.getWidth();
	
					slice.setStyles({
						height: this.containerSize.y,
						top: 0,
						width: 0
					});
				}

				this.animate.delay(100 + timeBuff, this, [slice, property, to]);				
                timeBuff+= 50;
            }, this);
        }
        else  // if(effect == 'fade')
        {
            slices.each(function(slice, i){
				if(orientation == 'horizontal')
				{
					slice.setStyle('width', this.containerSize.x);
				}
				else
				{
					slice.setStyle('height', this.containerSize.y);
				}
                this.animate.delay(100, this, [slice]);
            }, this);
        }
    },
    
    animate: function(slice, property, to)
    {
		this.count++;

        var fx = slice.retrieve('fxInstance');

        var styles = {
            opacity: 1    
        };
		styles[property] = to;

        fx.start(styles).chain(function(){
			if(this.count == this.options.slices)
			{
				this.running = false;
		
				// fire onFinish function
				this.finish();
	
				this.count = 0;
			}
		}.bind(this));		
    },
    
    /**
     * Events
     */
    
    finish: function()
    {
        this.fireEvent('finish');
    },

    start: function()
    {
        this.fireEvent('start');
    }

});