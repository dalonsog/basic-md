function MySelect (container, options, s){
    /* ATRIBUTOS */
    /* Publicos */
    // Selector CSS del elemento contenedor del select
    this.container = container;
    // Opciones del select
    this.options = options;
    // Ancho
    this.width = 200;
    // Tamaño de fuente
    this.font_size = 16;
    // Tiempo de animación
    this.transition = 400;
    // Z-index del select
    this.z_index = 1;
    // Número de elementos a mostrar
    this.elements;
    // Tipo de selector
    this.type = 'single';
    // Indica si se puede contraer/expandir o no
    this.collapsable = true;
    // Texto a mostrar cuando no hay nada seleccionado
    this.placeholder = '';
    /* Privados */
    // Parametro que guarda las settings que se le pasan al select
    var settings = s;
    // Parametro que indica si está activo o no, de esta forma en cualquier funcion puedes consultarlo y que no haga nada el select
    var disabled = false;
    // Ancho mínimo
    var min_width = 60;
    // Número mínimo de elementos a mostrar
    var min_elements = 1;
    // Número mínimo de elementos a mostrar
    var max_elements = 8;
    // Tiempo de animación mínimo
    var min_transition = 100;
    // Tamaño de fuente mínimo
    var min_font_size = 10;
    // Divs de opciones
    var options_divs = [];
    // Div de opción seleccionada
    var selected_div;
    // Valor/es seleccionado/s
    var selected_option = [];
    // Event listeners
    var eventListeners = {};
    // Object instance
    var self = this;
    /* METODOS */
    /* Publicos */
    /**
    ** Añade opciones al select.
    ** @_: array con las opciones nuevas.
    **/ 
    this.add_options = function (_) {
        self.options.concat(_);
        self.create_options(_);
    };
    /**
    ** Selecciona una opción o devuelve la opción seleccionada actualmente.
    ** @_: opción a seleccionar
    **/
    this.selected = function (_) {
        if (!arguments.length){
            if (self.type == 'single')
                return selected_option[0];
            else
                return selected_option;
        }
        // Si está deshabilitado no hacemos nada
        if (disabled)
            return;
        var key = '';
        if (self.type == 'single'){
            if (typeof _ === 'number')
                _ = typeof options[_] === 'object' ? options[_].value : _.toString();
            selected_option[0] = _;
            options_divs.show();
            var option = options_divs.filter('.option[data-value="'+_+'"]');
            option.hide();
            key = option.text();
        } else {
            if ( _ == '-all-'){
                if (selected_option.length != options_divs.length)
                    options_divs.addClass('checked');
                else
                    options_divs.removeClass('checked');
            }
            else {
                $(self.container + ' .select_all').removeClass('checked');
                _ = _ instanceof Array ? _ : [_];
                _.forEach(function(option){
                    if (typeof option === 'number')
                        options_divs[option].toggleClass('checked');
                    else
                        options_divs.filter('.option[data-value="'+option+'"]').toggleClass('checked');
                });
            }
            selected_option = [];
            options_divs.filter('.checked').each(function(i,e){
                selected_option.push($(e).attr('data-value'));
            });
            key = selected_option.join(', ');
        }
        if (key == '')
            key = self.placeholder;
        selected_div.html(key);
        if (typeof eventListeners.change === 'function')
            eventListeners.change();
    };
    /**
    ** Crea un event listener para el evento pasado por parámetro.
    ** @event: evento a escuchar
    ** @callback: función a ejecutar cuando se lance el evento
    **/
    this.on = function (event, callback) {
        eventListeners[event] = callback;
    };
    /**
    ** Elimina un event listener para el evento pasado por parámetro.
    ** @event: evento a dejar de escuchar
    **/
    this.off = function (event) {
        if(eventListeners[event])
            delete eventListeners[event];
    };
    /**
    ** Crea un event listener para el evento click.
    ** @callback: función a ejecutar cuando se lance el evento
    **/
    this.onclick = function (callback) {
        eventListeners['click'] = callback;
    };
    /**
    ** Crea un event listener para el evento change.
    ** @callback: función a ejecutar cuando se lance el evento
    **/
    this.onchange = function (callback) {
        eventListeners['change'] = callback;
    };
    /**
     ** Deshabilita o habilita el select.
     ** @dis: Parametro que marca si se habilita o no el select
     */
    this.set_disabled = function(dis){
        console.warn("MySelect.set_disable is deprecated. Please, use MySelect.disable() instead.");
        disabled = dis;
        var flecha = $(this.container + " .myselect.arrow");
        var container = $(this.container + " .container");
        if (dis) {
            container.css("color", "#cccccc");
            flecha.css("visibility", "hidden");
            $(this.container).attr('disabled', true);
        }
        else {
            container.css("color", typeof settings.color === 'string' ? settings.color : "#777");
            flecha.css("visibility", "visible");
            $(this.container).attr('disabled', false);
        }
    };
    /**
     * Devuelve el estado del select
     * @returns {boolean}
     */
    this.get_disabled = function(){
        console.warn("MySelect.get_disable is deprecated. Please, use MySelect.disable() instead.");
        return disabled;
    };
    /**
    ** Deshabilita/habilita el select o devuelve su estado actual si no se pasa nada por parámetro.
    ** @_: boolean que indica si se habilita/deshabilita el selector.
    **/
    this.disable = function(_) {
        if (!arguments.length)
            return disabled;
        disabled = _;
        var arrow = $(this.container + " .myselect.arrow");
        var container = $(this.container + " .container");
        if (_) {
            container.css("color", "#cccccc");
            arrow.css("visibility", "hidden");
            $(this.container).attr('disabled', true);
        }
        else {
            container.css("color", typeof settings.color === 'string' ? settings.color : "#777");
            arrow.css("visibility", "visible");
            $(this.container).attr('disabled', false);
        }
    }
    /**
    ** Crea un event listener para el evento change.
    ** @callback0: función a ejecutar cuando tenga foco
    ** @callback1: función a ejecutar cuando no tenga foco
    **/
    this.onfocus = function (callback0, callback1) {
        eventListeners['focus'] = [callback0, callback1];
    };
    /* Privados */
    /**
    ** Inicializa las opciones del select
    **/
    function set_settings () {
        if (typeof s === 'number')
            self.width = s;
        else if (typeof s === 'object'){
            self.width = typeof s.width === 'number' ? s.width : typeof s.width === 'string' ? s.width :self.width;
            self.transition = typeof s.transition === 'number' ? s.transition : self.transition;
            self.font_size = typeof s.font_size === 'number' ? s.font_size : self.font_size;
            self.z_index = typeof s.z_index === 'number' ? s.z_index : self.z_index;
            self.color = typeof s.color === 'string' ? s.color : self.color;
            self.font_weight = typeof s.font_weight === 'string' ? s.font_weight : self.font_weight;
            self.type = typeof s.type === 'string' ? s.type : self.type;
            self.elements = typeof s.elements === 'number' ? s.elements : self.elements;
            self.placeholder = typeof s.placeholder === 'string' ? s.placeholder : self.placeholder;
            self.collapsable = typeof s.collapsable === 'boolean' ? s.collapsable : self.collapsable;
            self.display = typeof s.display === 'string' ? s.display : self.display;
            self.display = typeof s.verticalAlign === 'string' ? s.verticalAlign : self.verticalAlign;
        }
        if (self.width < min_width)
            self.width = min_width;
        if (self.transition < min_transition)
            self.transition = min_transition;
        if (self.elements == undefined)
            self.elements = self.type == 'single' ? self.options.length-1 : self.options.length;
        if (self.elements < min_elements)
            self.elements = min_elements;
        else if (self.elements > max_elements)
            self.elements = max_elements;
        if (['single','multiple'].indexOf(self.type) == -1)
            self.type = 'single';
    }
    /**
    ** Crea los elementos HTML de las opciones pasadas por parámetro
    ** y les asigna su evento click.
    ** op: opciones a crear
    **/
    function create_options (op) {
        var div_principal = $(self.container+' .myselect.container');
        var div_options_box = $(self.container+' .myselect.options_container');
        var opt_num = options_divs.length;
        op.forEach(function(d, i){
            i += opt_num;
            var key = typeof d === 'object' ? d.key : d;
            var value = typeof d === 'object' ? d.value : i;
            var div_opcion;
            // Introduciendo '---' como key de la opción, se crea un separador
            if (value == '---')
                div_opcion = $('<div data-value="-separator-" class="myselect options_separator"></div>');
            else{
                div_opcion = $('<div data-value="'+value+'" class="myselect option"></div>');
                var div_opcion_texto = $('<div class="myselect option_text"></div>');
                if (self.type == 'multiple'){
                    var div_opcion_checkbox = $('<div class="myselect option_checkbox"><i class="material-icons">done</i></div>');
                    div_opcion.append(div_opcion_checkbox);
                }
                div_opcion_texto.html(key);
                div_opcion.append(div_opcion_texto);
                div_opcion.on('click', function(){
                    if (self.type == 'single'){
                        div_principal.toggleClass('active');
                        div_options_box.parent().stop();
                        div_options_box.parent().animate(toggle_animation(div_options_box.parent()),self.transition);
                    }
                    self.selected(value);
                });
            }
            div_options_box.append(div_opcion);
            //options_divs.push(div_opcion);
        });
        options_divs = div_options_box.find('.myselect.option');
    }
    /**
    ** Crea la estructura HTML del select.
    **/
    function create_select () {
        var contenedor = $(self.container);
        // Div principal MySelect
        var div_principal = $('<div class="myselect container '+self.type+'"></div>');
        div_principal.css({
            'width': self.width,
            'font-size': self.font_size,
            'z-index':self.z_index,
            'color':self.color,
            'font-weight': self.font_weight
        });
        // Div de la caja de opciones
        var div_options_box = create_options_box();
        // Div de la caja de seleccion
        var div_select_box = create_select_box(div_principal, div_options_box);
        // Evento de contraer/expandir
        if (self.collapsable)
            div_select_box.on('click', function(){
                div_principal.toggleClass('active');
                div_options_box.stop();
                div_options_box.animate(toggle_animation(div_options_box),self.transition);
            });
        // Añadir las cajas al contenedor
        div_principal.append(div_select_box);
        div_principal.append(div_options_box);
        contenedor.append(div_principal);
    }
    /**
    ** Crea la caja de elemento/s seleccionado/s
    ** div_principal: 
    ** return: objeto jQuery de la caja
    **/
    function create_select_box (div_principal, div_options_box) {
        var div_select_box = $('<div class="myselect select_box"></div>');
        var div_selected_text = $('<div class="myselect selected_text">'+self.placeholder+'</div>');
        selected_div = div_selected_text;
        if(self.collapsable){
            var div_arrow = $('<div class="myselect arrow"></div>');
            var arrow_icon = $('<i class="material-icons">expand_more</i>');
            div_arrow.html(arrow_icon);
        }
        div_select_box.append(div_selected_text);
        div_select_box.append(div_arrow);
        return div_select_box;
    }
    /**
    ** Crea la caja de opciones
    ** return: objeto jQuery de la caja
    **/
    function create_options_box () {
        var div_options_box = $('<div class="myselect options_box"></div>');
        var div_options_container = $('<div class="myselect options_container"></div>');
        if (self.type == 'multiple'){
            div_options_box.height(get_height());
            // Crea barra de búsqueda para select múltiple
            var div_search_box = $('<div class="myselect search_box"></div>');
            var div_search_icon = $('<div class="myselect search_icon"><i class="fa fa-search"></i></div>');
            var div_empty_icon = $('<div class="myselect search_icon empty hidden"><i class="fa fa-times-circle"></i></div>');
            var input_search = $('<input type="text" placeholder="Search">');
            div_empty_icon.on('click', function(){
                input_search.val('');
                toggle_options_shown('');
                div_empty_icon.addClass('hidden');
            });
            input_search.on('input', function(){
                var string = $(this).val();
                if (string != '')
                    div_empty_icon.removeClass('hidden');
                else
                    div_empty_icon.addClass('hidden');
                toggle_options_shown(string);
            });
            div_search_box.append(div_search_icon);
            div_search_box.append(input_search);
            div_search_box.append(div_empty_icon);
            //Crear las opciones de mostrar los parametros o solo lo seleccionado
            // options_divs[option].toggleClass('checked');
            var div_bloque=$('<div id="div_bloque_select" class="myselect"></div>');
            var div_select_mostrar = $('<div id="select_all" class="myselect seleccionados">' +
                                        '<div class="myselect option_checkbox">' +
                                        '<i class="material-icons">done</i>' +
                                        '</div>' +
                                  '<div class="myselect option_text">View All</div></div>');
            div_select_mostrar.addClass('checked');
            var div_select_selected = $('<div id="select_select" class="myselect seleccionados">' +
                                        '<div class="myselect option_checkbox">' +
                                        '<i class="material-icons">done</i>' +
                                        '</div>' +
                                  '<div class="myselect option_text">Selected</div></div>');
            div_bloque.append(div_select_mostrar);
            div_bloque.append(div_select_selected);
            div_select_mostrar.on('click',function(){
                $(self.container + ' .seleccionados').removeClass('checked');
                $(this).addClass('checked');
                $(this).find('.material-icons');
                options_divs.show();
            });
            div_select_selected.on('click',function(){
                $(self.container + ' .seleccionados').removeClass('checked');
                $(this).addClass('checked');
                options_divs.hide();
                options_divs.filter('.checked').show();

            });
            // Crea la opción select all
            //var div_select_all = $('<div class="myselect select_all">Select All</div>');
            var div_select_all = $('<div data-value="all" class="myselect option select_all">' +
                                        '<div class="myselect option_checkbox">' +
                                        '<i class="material-icons">done</i></div>' +
                                  '<div class="myselect option_text">All</div></div>');
            div_select_all.on('click', function(){
                self.selected('-all-');
            });
            div_options_box.append(div_search_box);
            div_options_box.append(div_bloque);
            div_options_container.append(div_select_all);
        }
        if (self.collapsable)
            div_options_box.hide();
        if (self.options.length > max_elements)
            div_options_container.css('overflow-y', 'scroll');
        div_options_box.append(div_options_container);
        return div_options_box;
    }
    /**
    ** Muestra u oculta las opciones según contengan la cadena pasada por parámetro.
    ** Busca en el contenido tanto de key como de value de cada opción.
    ** string: cadena a contener
    **/
    function toggle_options_shown (string) {
        string = string.toLowerCase();
        options_divs.each(function(i,e){
            ($(e).text().toLowerCase().indexOf(string) == -1 && $(e).attr('data-value').toLowerCase().indexOf(string) == -1) ? $(e).hide() : $(e).show();
        });
    }
    /**
    ** Calcula la altura de la caja de opciones en función del número de elementos a mostrar
    **/
    function get_height () {
        var opt_size = 33;
        var search_box = 47;
        var select_all = 36;
        var view_all = 25;
        var size = opt_size * self.elements;
        if (self.type == 'multiple')
            size += search_box+view_all+select_all;
        return size.toString() + 'px';
    }
    /**
    ** Ajusta la dirección de la animación de abrir/cerrar
    ** las opciones para evitar hacer scroll en la pagina
    **/
    function toggle_animation (elem) {
        if (disabled)
            return;
        var upside_down = {
            'height': 'toggle',
            'top': elem.parent().hasClass('active') ? '-'+get_height() : '0px',
            'opacity': 'toggle'
        };
        var def = {
            'height': 'toggle',
            'opacity': 'toggle'
        };
        return elem.parent().offset().top + elem.height() > $(document).height() ? upside_down : def;
    }
    /**
    ** Comprueba los parámetros del select.
    **/
    function check_parameters () {
        if (!self.options){
            console.warn("TONTOLPIJO, NO HAS METIDO OPCIONES");
            return false;
        }else if (!self.container || !$(self.container).length){
            console.warn("DAME CONTENEDOR, JOPUTA");
            return false;
        }
        return true;
    }
    /**
    ** Inicializa el select.
    **/
    function _init () {
        if (check_parameters()){
            set_settings();
            create_select();
            create_options(self.options);
            if (self.type == 'single')
                self.selected(typeof options[0] == 'object' ? options[0].value : '0');
            $(document).on('click', function(e){
                if (disabled)
                    return;
                var container = $(self.container).find('.container');
                var div_options_box = $(self.container+' .myselect.options_box');
                if (!container.is(e.target) && container.has(e.target).length === 0){
                    if(container.hasClass('active')){
                        container.removeClass('active');
                        div_options_box.stop();
                        div_options_box.animate(toggle_animation(div_options_box),self.transition);
                    }
                    if (typeof eventListeners['focus'] === 'object' &&
                       typeof eventListeners['focus'][1] === 'function')
                       eventListeners['focus'][1]();
                }
            });
            $(self.container + ' .select_box').on('click', function() {
               if (typeof eventListeners['focus'] === 'object' &&
                   typeof eventListeners['focus'][0] === 'function')
                   eventListeners['focus'][0]();
               if (typeof eventListeners['click'] === 'function')
                   eventListeners['click']();
            });
        }
        $(self.container).data('myselect', self);
    }

    _init();

    return this;
}