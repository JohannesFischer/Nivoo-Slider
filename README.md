Nivoo-Slider
============

The Nivoo-Slider is an image gallery based on the jQuery Plugin NivoSlider (http://nivo.dev7studios.com/). It features 18 different transition effects.

![Screenshot 1](http://www.johannes-fischer.de/assets/Labs/nivoo-slider.png)

How to use
----------

Just include NivooSider.js and the NivooSlider.css to your HTML:

	#HTML
	<script type="text/javascript" src="NivooSlider.js"></script>
	<link  href="NivooSlider.css" rel="stylesheet" type="text/css" media="screen" />
	
And the gallery structure:
	
	#HTML
	 <div id="Slider" class="nivoo-slider">
        <img src="images/1268244.jpg" alt="" title="This is an example of a caption" height="350" width="600" />
        <a href="#">
            <img src="images/1269388.jpg" alt="" title="You can also link images (events will be delegated)" height="350" width="600" />
        </a>
        <img src="images/1270048.jpg" alt="" title="" height="350" width="600" />
        <img src="images/1270256.jpg" alt="" title="This is another example of a caption" height="350" width="600" />
    </div>	
	
And then initialize the slider using the domready event:

	#JS
	window.addEvent('domready',function(){

		// The simple way
		new NivooSlider($('Slider'));
		
		// The more advanced way
		new NivooSlider($('Slider'), {
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
	var slider = new NivooSlider(element[, options]);
	
#### Arguments ####
1. element - (mixed) An Element or the string id of an Element to apply the gallery to.
2. options - (object, optional) The Nivoo-Slider options object, described below:

#### Options ####
- animSpeed - (number: defaults to 500) The time (duration) in ms of the transition
- autoPlay - (bool: defaults to true) Start the transition automatically after initializing
- cssClass - (string, defaults to nivooSlider) Name of the css class that is added after initializing the slider
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

#### horizontal & vertical ####
- fade
- fold
- random

#### horizontal ####
- sliceLeftDown
- sliceLeftUp
- sliceLeftRightDown
- sliceLeftRightUp
- sliceRightDown
- sliceRightUp
- wipeDown
- wipeUp

#### vertical ####
- sliceDownLeft
- sliceDownRight
- sliceUpDownLeft
- sliceUpDownRight
- sliceUpLeft
- sliceUpRight
- wipeLeft
- wipeRight

Coming Features
---------------
- preloading images

License
-------
MIT-style license.