(function(gmaps){
	function getCanvasXY(currentLatLng,map)
	{
		console.log("get canvas xy");
		var scale=Math.pow(2,map.getZoom());
		console.log("scale: "+scale);
		var nw=new gmaps.LatLng(map.getBounds().getNorthEast().lat(),map.getBounds().getSouthWest().lng());
		var worldCoordinateNW=map.getProjection().fromLatLngToPoint(nw);
		var worldCoordinate=map.getProjection().fromLatLngToPoint(currentLatLng);
		console.log("North West: "+worldCoordinateNW);
		console.log("Current: "+worldCoordinate);
		var x=Math.floor(worldCoordinate.x-worldCoordinateNW.x)*scale;
		var y=Math.floor(worldCoordinate.y-worldCoordinateNW.y)*scale;
		console.log("diff x: "+x+" y:"+y);
		var offset=new gmaps.Point(x,y);
		console.log(offset);
		return offset;
	}

	function setMenuXY(currentLatLng,map)
	{
		//includes borders and stuff...clientWidth does not include these
		console.log("Inside setMenuXY");
		var mapDiv=document.getElementById("map-canvas"),
		mapWidth=mapDiv.offsetWidth,
		mapHeight=mapDiv.offsetHeight;
		console.log("Map width: "+mapWidth+" height: "+mapHeight);
		var menuDiv=document.getElementsByClassName("contextMenuContainer")[0];
		console.log(menuDiv);
		var menuWidth=menuDiv.offsetWidth,
		menuHeight=menuDiv.offsetHeight,
		pos=getCanvasXY(currentLatLng,map),
		x=pos.x,
		y=pos.y;
		console.log(pos);
		console.log("Menu width: "+menuWidth+" height: "+menuHeight);
		console.log("x: "+x,+" y: "+y);
		if((mapWidth-x)<menuWidth)	x=x-menuWidth;
		if((mapHeight-y)<menuHeight)	y=y-menuHeight;
		console.log("After checking to ensure if safe");
		console.log("x: "+x+"y: "+y);
		menuDiv.style.left=""+x+"px";
		menuDiv.style.top=""+y+"px";
		console.log("left: "+menuDiv.style.left+" top: "+menuDiv.style.top);	
	}
	var contextMenu=null;
	return{

		createMenuItems:function(items)
		{
			console.log("Create Menu Items");
			var i=0,
			res=[];
			for(i=0;i<items.length;i++)
			{
				var temp=document.createElement("li");
				temp.innerHTML=items[i];
				res[i]=temp;
			}
			console.log(res);
			return res;
		},
		createContextMenu:function(menuItems)
		{
			console.log("create context menu");
			var res=document.createElement("div");
			res.className="contextMenuContainer";
			var menu=document.createElement("ul");
			menu.className="context-menu";
			menu.style["list-style-type"]="none";
			res.appendChild(menu);
			var inner=document.createDocumentFragment();
			for(var i=0;i<menuItems.length;i++)	inner.appendChild(menuItems[i]);
			menu.appendChild(inner);
			return res;
		},
		showContextMenu:function(currentLatLng,map)
		{
			console.log("show context menu");
			//create the context-menu
			var projection;
			projection=map.getProjection();
			if(contextMenu)
			{
				contextMenu=this.destroyContextMenu();
			}
			contextMenu=this.createContextMenu(this.createMenuItems(["from SAP","to SAP"]));
			map.getDiv().appendChild(contextMenu);
			setMenuXY(currentLatLng,map);
			console.log(contextMenu);
			contextMenu.style.visibility="visible";
		},
		destroyContextMenu:function()
		{
			console.log("Destroy context menu");
			//ensure that the context menu is not available and non-reusable
			contextMenu.style.visibility="hidden";
			console.log("visibility: "+contextMenu.style.visibility);
			console.log("The number of children inside menu " +contextMenu.children.length);
			var ul=contextMenu.firstChild;
			console.log("List: "+ul);
			console.log("The number of children inside ul "+ul.children.length);
			var li_all=ul.children;
			console.log("All the li "+li_all);
			for(var i=0;i<ul.children.length;i++)
			{
				console.log("removing "+li_all[i]);
				ul.remove(li_all[i]);
				li_all[i]=null;
			}
			console.log("Getting rid of ul");
			contextMenu.remove(ul);
			ul=null;
			console.log("Destroying the menu");
			if(contextMenu.parentElement)
			{
				console.log("Parent of context menu "+contextMenu.parentElement);
				contextMenu.parentElement.removeChild(contextMenu);
			}	
			contextMenu=null;
			return contextMenu;
		},
		disable:function(map)
		{
			gmaps.event.clearListeners('rightclick');
			gmaps.event.addListener(map,'rightclick',function(event){
				console.log("Context menu has been disabled");
			});
		},
		enable:function(map)
		{
			gmaps.event.addListener(map,'rightclick',function(event){
				this.showContextMenu(event.latLng, map);
			});
		},
		set:function(menu)
		{
			contextMenu=menu;
		}
	})(window.google.maps)
