$(document).on('ready', function(){
	// Fill sidebar options
	(function(){
		options.forEach(function (op) {
			if (op.template){
				$option = $('<a></a>');
				$option.attr('href', op.template + '.html');
				$suboption_container = undefined;
			}
			else{
				$option = $('<div></div>');
				$suboption_container = $('<div></div>');
				$suboption_container.addClass('sidebar-suboption-container');
				op.options.forEach(function (subop) {
					if (subop.template){
						$suboption = $('<a></a>');
						$suboption.addClass('sidebar-suboption');
						$suboption.attr('href', subop.template + '.html');
						$suboption.html(subop.key);
						$suboption_container.append($suboption);	
					} else {
						$suboption = $('<div></div>');
						$suboption.addClass('sidebar-suboption');
						$subsuboption_container = $('<div></div>');
						$subsuboption_container.addClass('sidebar-subsuboption-container');
						subop.options.forEach(function (subsubop) {
							$subsuboption = $('<a></a>');
							$subsuboption.addClass('sidebar-subsuboption');
							$subsuboption.attr('href', subsubop.template + '.html');
							$subsuboption.html('+ ' + subsubop.key);
							$subsuboption_container.append($subsuboption);
						});
						$suboption.html(subop.key);
						$suboption_container.append($suboption);
						$suboption_container.append($subsuboption_container);
					}
				});
			}
			$option.addClass('sidebar-option');
			$option.html(op.key);
			$('.sidebar-content').append($option);
			if ($suboption_container)
				$('.sidebar-content').append($suboption_container);
		});
	})();
	// Toggle menu
	$('.menu-icon i, .sidebar-mask').on('click', function(){
		$('.sidebar, .sidebar-mask').toggleClass('close');
	});
	// Toggle option
	$('.sidebar-subsuboption-container').each(function(){
		$(this).data('height', $(this).height());
		$(this).css('height', 0);
	});
	$('div.sidebar-suboption').on('click', function(){
		$(this).next().css('height', function(){
			var height = $(this).height() ? 0 :  $(this).data('height');
			var parent_height = parseInt($(this).parent().data('height'));
			$(this).parent().data('height', height ? parent_height + height : parent_height - $(this).data('height'));
			$(this).parent().css('height', $(this).parent().data('height'));
			return height;
		});
	});
	$('.sidebar-suboption-container').each(function(){
		$(this).data('height', $(this).height());
		$(this).css('height', 0);
	});
	$('div.sidebar-option').on('click', function(){
		$(this).next().css('height', $(this).next().height() ? 0 :  $(this).next().data('height'));
	});
	// Radio Button controller
	$('.myradio-container:not(.disabled)').on('click', function(){
		$(this).parent().find('.myradio-container').removeClass('checked');
		$(this).addClass('checked');
	});
	// Checkbox controller
	$('.mycheckbox-container:not(.disabled)').on('click', function(){
		$(this).toggleClass('checked');
	});
	// Tab controller
	$('.mytab-tab:not(.disabled)').on('click', function(){
		$(this).parent().find('.mytab-tab').removeClass('active');
		$(this).toggleClass('active');
		tab_change($(this).attr('data-value'));
	});
	function tab_change (tab) {
		if (tab){
			$('.mybox-content').hide();
			$('.mybox-content[data-tab="'+tab+'"]').show();
		}
	}
	tab_change($('.mytab-tab.active').attr('data-value'));
	// Dialog controller
	$('#open_dialog_button').on('click', function(){
		$('.mydialog, .mydialog-mask').addClass('visible')
		$('body').css('overflow-y','hidden');
	});
	$('.mydialog-mask, .mydialog-button').on('click', function(){
		$('.mydialog, .mydialog-mask').removeClass('visible')
		$('body').css('overflow-y','auto');
	});
	// Loader controller
	if (typeof MyLoader === 'function'){
		var loader = new MyLoader($('.mybox-content'));
		$('#trigger_loader_button').on('click', function(){
			loader.show();
			setTimeout(function(){
				$('#content1, #content2').toggle();
				loader.hide();
			},2000);
		});
	}
	// Menu controller
	// Abrir/cerrar menú
	$('.mymenu i').on('click', function(){
		$(this).parent().toggleClass('visible');
	});
	// Cerrar al clickar fuera
	$(document).on('click', function(event){
		$('.mymenu').each(function(i,e){
			if(!$(e).is(event.target) && $(e).has(event.target).length === 0)
				$(e).removeClass('visible');
		});
	});
	// Switch controller
	$('.myswitch:not(.disabled)').on('click', function(){
		$(this).toggleClass('active');
	});
	// Slider controller
	var slider1 = $('#slider1-container')[0];

	if (slider1)
		noUiSlider.create(slider1, {
			start: 20,
			connect: 'lower',
			range: {
				'min': 0,
				'max': 100
			}
		});

	var slider2 = $('#slider2-container')[0];

	if (slider2)
		noUiSlider.create(slider2, {
			start: [20, 80],
			connect: true,
			range: {
				'min': 0,
				'max': 100
			}
		});

	var slider3 = $('#slider3-container')[0];

	if (slider3){
		noUiSlider.create(slider3, {
			start: [20, 80],
			connect: true,
			range: {
				'min': 0,
				'max': 100
			}
		});
		slider3.setAttribute('disabled', true);
	}	
});