Nivoo-Slider
============

The Nivoo-Slider is an image gallery based on the jQuery Plugin NivoSlider (http://nivo.dev7studios.com/). It features 14 different transition effects.

![Screenshot 1](http://www.johannes-fischer.de/assets/Labs/nivoo-slider.png)

How to use
----------

Just include NivooSider.js and the NivooSlider.css to your HTML:

	#HTML
	<script type="text/javascript" src="NivooSlider.js"></script>
	<link  href="NivooSlider.css" rel="stylesheet" type="text/css" media="screen" />
	
And the gallery structure:
	
	#HTML
	 <div id="slider">
        <img src="images/image1.jpg" alt="" title="insert text to display a caption" />
        <a href="#hyperlink">
            <img src="images/iamge2.jpg" alt="" title="This image is linked to a great website" />
        </a>
        <img src="images/image3.jpg" alt="" />
    </div>	
	
And then initialize the slider using the domready event:

	#JS
	window.addEvent('domready',function(){

		// The simple way
		new NivooSlider($('slider'));
		
		// The more advanced way
		new NivooSlider($('slider'), {
            animSpeed: 750,
            effect: 'sliceLeftRightDown',
			interval: 5000,
            orientation: 'horizontal',
			slices: 20
        }).addEvents({
            'onFinish': function(){
                // fired after each transition
            },
            'onStart': function(){
                // fired right before each transition
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
- directionNav -(bool: deafults to true) Shows controls to go back and forth
- directionNavHide - (bool: defaults to false) Hides the navigation controls on mouseout, so they are only visible when the mouse cursor is over the slider element
- effect - (string: defaults to sliceDown) Type of transition (see effects),
- interval - (number: defaults to 3000) Interval in ms between the transitions, required for the autoPlay function
- orientation - (string: defaults to vertical) Defines the direction of the transition, can be horizontal or vertical
- pauseOnHover - (bool: defaults to true) Clears the interval on mouseover
- slices - (number: defaults to 15) Number of the slices used for the transition

#### Events ####
- start - (function) Is fired right before each transition
- finish - (function) Is fired right after each transition

Effects
-------

#### horizontal ####
- fade
- fold
- sliceLeftDown
- sliceLeftUp
- sliceLeftRightDown
- sliceLeftRightUp
- sliceRightDown
- sliceRightUp

#### vertical ####
- fade
- fold
- sliceDownLeft
- sliceDownRight
- sliceUpDownLeft
- sliceUpDownRight
- sliceUpLeft
- sliceUpRight

Coming Features
---------------
- preloading images

License
-------
MIT-style license.