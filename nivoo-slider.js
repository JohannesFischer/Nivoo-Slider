/*
 * Nivoo Slider v0.1
 * MooTools-Port of the Nivo-Slider: http://nivo.dev7studios.com
 *
 * Johannes Fischer
 * http://www.johannes-fischer.de/
 *
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 */

var NivooSlider = new Class({

    Implements: [Events,Options],

    children: null,
    containerSize: 0,
    currentSlide: 0,
    currentImage: '',
    effects: ['sliceDownRight','sliceDownLeft','sliceUpRight','sliceUpLeft','sliceUpDown','sliceUpDownLeft','fold','fade'],
    paused: false,
    running: false,
    totalSlides: 0,

    options: {
        animSpeed: 500,
        autoPlay: false,
        effect:'sliceDown',
        slices: 15,        
        pauseTime: 3000,
        
        directionNav: true,
        directionNavHide: true,
        controlNav: true,
        pauseOnHover: true
        //onStart: $empty(),
        //onFinish: $empty()
    },
    
    initialize: function(container, options)
    {
        this.container = $(container);
        this.setOptions(options);
        
        this.init();
        this.createSlices();
        if(this.options.autoPlay)
        {
            this.slide.periodical(this.options.pauseTime, this);
        }
    },
    
    /**
     * GETTER
     */
    
    getSlices: function()
    {
        return this.container.getElements('.nivo-slice');    
    },
    
    init: function()
    {
		this.container.addClass('nivoSlider');

        this.containerSize = this.container.getSize();
        
        //Find our slider children
        this.children = this.container.getChildren();

        this.totalSlides = this.children.length;

        this.children.setStyle('display','none');

        this.currentImage = this.children[0];

        //Set first background
		this.container.setStyle('background-image', 'url('+this.currentImage.get('src')+')');
    },
    
    createSlices: function()
    {
        this.options.slices.each(function(i){
            var sliceWidth = (this.container.getWidth()/this.options.slices).round();

            var slice = new Element('div', {
                'class': 'nivo-slice',
                styles: {
                    left: sliceWidth*i,
                    width: i == this.options.slices-1 ? this.container.getWidth()-(sliceWidth*i) : sliceWidth
                }
            }).inject(this.container);

            slice.store('fxInstance', new Fx.Morph(slice, {
                duration: 500//this.options.animSpeed
            })); 
        }, this);
    },
    
    slide: function()
    {
        // TODO Set current background before change
        this.container.setStyle('background-image','url('+this.currentImage.get('src') +')');
        /*
        if(!nudge){
            slider.css('background','url('+ currentImage.attr('src') +') no-repeat');
        } else {
            if(nudge == 'prev'){
                slider.css('background','url('+ currentImage.attr('src') +') no-repeat');
            }
            if(nudge == 'next'){
                slider.css('background','url('+ currentImage.attr('src') +') no-repeat');
            }
        }
        */
        this.currentSlide++;
        if(this.currentSlide == this.totalSlides) this.currentSlide = 0;
        if(this.currentSlide < 0) this.currentSlide = (this.totalSlides - 1);
        
        // Set currentImage
        this.currentImage = this.children[this.currentSlide];

        //Set acitve links
        // ...

        //Process caption
        /*if(currentImage.attr('title') != ''){
            if($('.nivo-caption', slider).css('display') == 'block'){
                $('.nivo-caption p', slider).fadeOut(settings.animSpeed, function(){
                    $(this).html(currentImage.attr('title'));
                    $(this).fadeIn(settings.animSpeed);
                });
            } else {
                $('.nivo-caption p', slider).html(currentImage.attr('title'));
            }					
            $('.nivo-caption', slider).fadeIn(settings.animSpeed);
        } else {
            $('.nivo-caption', slider).fadeOut(settings.animSpeed);
        }*/
        
        //Set new slice backgrounds
        var slices = this.getSlices();

        slices.each(function(slice, i){
            var sliceWidth = (this.container.getWidth()/this.options.slices).round();
            slice.setStyles({
                background: 'url('+this.currentImage.get('src')+') no-repeat -'+ ((sliceWidth + (i * sliceWidth)) - sliceWidth) +'px 0%',
                height: 0,
                opacity: 0
            });
        }, this);

        var randomEffect = false;

        if(this.options.effect == 'random')
        {
            randomEffect = this.effects.getRandom();
        }
    
        // Run effects
    
        var effect = randomEffect || this.options.effect;
        var timeBuff = 0;

        this.running = true;
        
        // fire onStart function
        this.start();

        if(['sliceDown', 'sliceDownRight', 'sliceDownLeft'].contains(effect))
        {
            if(effect == 'sliceDownLeft')
            {
                slices = slices.reverse();
            }

            slices.each(function(slice, i){
                //var fx = slice.retrieve('fxInstance');

                slice.setStyle('top', 0);
    
                this.animate.delay(100 + timeBuff, this, [slice, 'height']);

                timeBuff += 50;
            }, this);
        }
        else if(['sliceUp', 'sliceUpRight', 'sliceUpLeft'].contains(effect))
        {
            if(effect == 'sliceUpLeft')
            {
                slices = slices.reverse();
            }
            slices.each(function(slice, i){
                var fx = slice.retrieve('fxInstance');
                
                slice.setStyle('bottom', 0);

                this.animate.delay(100 + timeBuff, this, [slice, 'height']);

                timeBuff += 50;
            }, this);
        }
        else if(['sliceUpDown', 'sliceUpDownRight', 'sliceUpDownLeft'].contains(effect))
        {
            if(effect == 'sliceUpDownLeft')
            {
                slices = slices.reverse();
            }
            slices.each(function(slice, i){
                var fx = slice.retrieve('fxInstance');

                if(i%2 == 0)
                {
                    slice.setStyle('top', 0);
                }
                else
                {
                    slice.setStyle('bottom', 0);
                }

                this.animate.delay(100 + timeBuff, this, [slice, 'height']);

                timeBuff += 50;
            }, this);
        }
        else if(effect == 'fold')
        {
            slices.each(function(slice, i){

                var width = slice.getWidth();

                slice.setStyles({
                    height: this.containerSize.y,
                    top: 0,
                    width: 0
                });

                this.animate.delay(100 + timeBuff, this, [slice, 'width', width]);

                timeBuff += 50;
            }, this);
        }
        else if(effect == 'fade')
        {
            slices.each(function(slice, i){
                slice.setStyle('height', this.containerSize.y);
                this.animate.delay(100, this, [slice]);
            }, this);
        }

        this.running = false;

        // fire onFinish function
        this.finish();
    },
    
    animate: function(slice, property, to)
    {
        var fx = slice.retrieve('fxInstance');
        var styles = {
            opacity: 1    
        };

        if(property == 'height')
        {
            styles.height= this.containerSize.y;
        }
        else if(property == 'width')
        {
            styles.width= to;
        }
        fx.start(styles);
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
/*		
			//Create caption
			slider.append(
				$('<div class="nivo-caption"><p></p></div>').css('display','none')
			);
			//Process initial  caption
			if(currentImage.attr('title') != ''){
				$('.nivo-caption p', slider).html(currentImage.attr('title'));					
				$('.nivo-caption', slider).fadeIn(settings.animSpeed);
			}
			
			//In the words of Super Mario "let's a go!"
			var timer = setInterval(function(){ nivoRun(slider, kids, settings, false); }, settings.pauseTime);
			
			//Add Direction nav
			if(settings.directionNav){
				slider.append('<div class="nivo-directionNav"><a class="nivo-prevNav">Prev</a><a class="nivo-nextNav">Next</a></div>');
				
				//Hide Direction nav
				if(settings.directionNavHide){
					$('.nivo-directionNav', slider).hide();
					slider.hover(function(){
						$('.nivo-directionNav', slider).show();
					}, function(){
						$('.nivo-directionNav', slider).hide();
					});
				}
				
				$('a.nivo-prevNav', slider).live('click', function(){
					if(running) return false;
					clearInterval(timer);
					timer = '';
					currentSlide-=2;
					nivoRun(slider, kids, settings, 'prev');
				});
				
				$('a.nivo-nextNav', slider).live('click', function(){
					if(running) return false;
					clearInterval(timer);
					timer = '';
					nivoRun(slider, kids, settings, 'next');
				});
			}
			
			//Add Control nav
			if(settings.controlNav){
				var nivoControl = $('<div class="nivo-controlNav"></div>');
				slider.append(nivoControl);
				for(var i = 0; i < kids.length; i++){
					nivoControl.append('<a class="nivo-control" rel="'+ i +'">'+ (i + 1) +'</a>');
				}
				//Set initial active link
				$('.nivo-controlNav a:eq('+ currentSlide +')', slider).addClass('active');
				
				$('.nivo-controlNav a', slider).live('click', function(){
					if(running) return false;
					if($(this).hasClass('active')) return false;
					clearInterval(timer);
					timer = '';
					slider.css('background','url('+ currentImage.attr('src') +') no-repeat');
					currentSlide = $(this).attr('rel') - 1;
					nivoRun(slider, kids, settings, 'control');
				});
			}
			
			//For pauseOnHover setting
			if(settings.pauseOnHover){
				slider.hover(function(){
					paused = true;
					clearInterval(timer);
					timer = '';
				}, function(){
					paused = false;
					//Restart the timer
					if(timer == ''){
						timer = setInterval(function(){ nivoRun(slider, kids, settings, false); }, settings.pauseTime);
					}
				});
			}
			
			//Event when Animation finishes
			slider.bind('nivo:animFinished', function(){ 
				running = false; 
				//Hide child links
				$(kids).each(function(){
					if($(this).is('a')){
						$(this).css('display','none');
					}
				});
				//Show current link
				if($(kids[currentSlide]).is('a')){
					$(kids[currentSlide]).css('display','block');
				}
				//Restart the timer
				if(timer == '' && !paused){
					timer = setInterval(function(){ nivoRun(slider, kids, settings, false); }, settings.pauseTime);
				}
				//Trigger the afterChange callback
				settings.afterChange.call(this);
			});
		});
		
		
	};
 */