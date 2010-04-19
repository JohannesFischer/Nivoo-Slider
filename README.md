Nivoo-Slider
============

...


How to use
----------

Just include nivoo-lider.js and the nivoo-slider.css to your HTML:

	#HTML
	<script type="text/javascript" src="/js/nivoo-slider.js"></script>
	<link  href="/css/nivoo-slider.css" rel="stylesheet" type="text/css" media="screen" />
	
And the gallery structure:
	
	#HTML
	 <div id="slider">
        <img src="images/image1.jpg" alt="" title="insert text to display a caption" />
        <img src="images/iamge2.jpg" alt="" />
        <img src="images/image3.jpg" alt="" />
    </div>	
	
And then initialize the slider:

	#JS
	window.addEvent('domready',function(){

		// The simple way
		new NivooSlider($('slider'));
		
		// The more advanced way
		new NivooSlider($('slider'), {
            autoPlay: true,
            effect: 'sliceUpDown',
            pauseOnHover: true
        }).addEvents({
            'onFinish': function(){
                // fired after the transition
            },
            'onStart': function(){
                // fired right before the transition
            }
        });

	}

Documentation
-------------

## Class: NivooSlider ##

### Syntax ###

	#JS
	var slider = new NivooSlider($('myGallery'));
	
#### Arguments ####
1. element - (element,string) An Element or the string id of an Element to apply the gallery to.

#### Options ####
- animSpeed - (number: defaults to 500) The time (duration) in ms of the transition
- autoPlay - (bool: defaults to true) Start the transition automatically after initializing
- effect - (string: defaults to sliceDown) Type of transition (fade, fold, sliceDownLeft, sliceDownRight, sliceUpDown, sliceUpDownLeft, sliceUpLeft, sliceUpRight),
- interval - (number: defaults to 3000) Interval in ms between the transitions, needed for autoPlay
- pauseOnHover - (bool: defaults to true) Clears the interval on mouseover
- slices - (number: defaults to 15) Number of the vertical slices used for the transition

#### Events ####
- start - (function) Is fired right before theeach animation
- finish - (function) Is fired right after each animation


License
-------
MIT-style license.