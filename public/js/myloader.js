function MyLoader(container, type) {
	if (!$(container))
		return
	this.loader_type = type ? type : "circle";
	this.loader = eval("create_"+this.loader_type)(container);

	this.show = show;
	this.hide = hide;
	return this;

	function create_circle(container) {
		//D3 LOADER
		var loader = d3.select($(container).get(0))
						.append('div')
						.classed('loader myloader', true)
						.classed('hide', true);
		var svg = loader.append('svg')
						.attr('viewBox', '25 25 50 50');
		var circle = svg.append('circle')
						.classed('path', true)
						.attr('cx', 50)
						.attr('cy', 50)
						.attr('r', 20)
						.attr('fill', 'none')
						.attr('stroke-width', 3)
						.attr('stroke-miterlimit', 10)
						.attr('stroke', "#B1B1B1");
		return loader;
	}
}

function show() {
	this.loader.classed('hide', false);
	//Se muestra el svg
	this.loader.select('svg')
			   .classed('circular', true)
	//Se ocultan los hermanos
	$(this.loader[0]).parent().children().each(function() {
		if (!$(this).hasClass("loader"))
			$(this).addClass("hide_loader_brother");
	});
	return this;
}

function hide() {
	this.loader.classed('hide', true);
	//Se oculta el svg
	this.loader.select('svg')
			   .classed('circular', false)
	//Se muestran los hermanos
	$(this.loader[0]).parent().children().each(function() {
		if (!$(this).hasClass("loader"))
			$(this).removeClass("hide_loader_brother");
	});
	return this;
}
