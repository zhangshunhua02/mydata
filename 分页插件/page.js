(function(window,undefined){
	function Page(options){
		this.options = options;
		this.options.event_type = this.options.event_type || "click";
		this.options.pageStyle = {};
		this.options.pageStyle.width = this.options.pageStyle.width || "40px";
		this.options.pageStyle.height = this.options.pageStyle.height || "40px";
		this.options.pageStyle.margin = this.options.pageStyle.margin || "5px";
		this.li_w = parseFloat(this.options.pageStyle.width) + parseFloat(this.options.pageStyle.margin)*2;
		this.init = ()=>{
			this.createLink();
			this.create();
			
		}
		this.init();
		
	}
	Page.prototype.create = function(){
		var arr = [].concat(this.createButton())
		arr.splice(2,0,this.createPages());
		var div = document.createElement("div");
		div.id = "box";
		div.style.height = parseFloat(this.options.pageStyle.height) + parseFloat(this.options.pageStyle.margin)*2 + "px";
		for(var i=0;i<arr.length;i++){
			if(!this.options.button.isShow){
				if(arr[i].className == "first" || arr[i].className == "last") continue;
			}
			div.appendChild(arr[i]);
		}
		this.box = div;
		document.body.appendChild(div);
		this.lis = this.box.querySelectorAll("li");
		this.ul = this.box.querySelector("ul");
		this.bindEvent();
	}
	Page.prototype.createLink = function(){
		var link = document.createElement("link");
		link.href = "default.css";
		link.rel="stylesheet";
		document.head.appendChild(link);
	}
	Page.prototype.createPages = function(){
		var div = document.createElement("div");
		div.id = "pages";
		div.style.width = this.options.showItems*this.li_w + "px";
		div.style.height = parseFloat(this.options.pageStyle.height) + parseFloat(this.options.pageStyle.margin)*2 + "px";
		div.appendChild(this.createUl());
		return div;
	}
	Page.prototype.createUl = function(){
		var ul = document.createElement("ul");
		ul.style.width = this.options.pages*this.li_w + "px";
		ul.appendChild(this.createLi());
		return ul;
	}
	Page.prototype.createLi = function(){
		var frag = document.createDocumentFragment();
		for(var i=0;i<this.options.pages;i++){
			var li = document.createElement("li");
			li.innerHTML = i + 1;
			li.index = i;
			if(i == 0) li.className = "active";
			for(let p in this.options.pageStyle){
				li.style[p] = this.options.pageStyle[p];
			}
			li.style.lineHeight = this.options.pageStyle.height;
			frag.appendChild(li);
		}
		return frag;
	}
	Page.prototype.createButton = function(){
		var arr = [];
		var prev = document.createElement("button");
		prev.innerText = this.options.button.prev || "上一页";
		prev.className = "prev";

		var next = document.createElement("button");
		next.innerText = this.options.button.next || "下一页";
		next.className = "next";
		var first = document.createElement("button");
		first.className = "first";
		first.innerText = this.options.button.first || "首页";
		var last = document.createElement("button");
		last.className = "last";
		last.innerText = this.options.button.last || "尾页";
		arr.push(first,prev,next,last);
		return arr;
	},
	Page.prototype.bindEvent = function(){
		var that = this;
		let {box,options:{event_type}} = that;
		box["on"+event_type] = function(evt){
			var e = evt || window.event;
			var target = e.target || window.event;
			switch(true){
				case target.className == "next":
					that.options.currentPage++;
					if(that.options.currentPage > that.options.pages - 1){
						that.options.currentPage = that.options.pages - 1;
					}
					that.changePage(that.options.currentPage);
				break;
				case target.className == "prev":
					that.options.currentPage--;
					if(that.options.currentPage < 0){
						that.options.currentPage = 0;
					}
					that.changePage(that.options.currentPage);
				break;
				case target.tagName == "LI":
					that.options.currentPage = target.index;
					that.changePage(that.options.currentPage);
					if(that.options.currentPage < Math.floor(that.options.showItems/2)){
						that.ul.style.left = 0;
					}else if(that.options.currentPage >= that.options.pages - Math.floor(that.options.showItems/2)){
						that.ul.style.left = -(that.options.pages - that.options.showItems)*li_w + "px";
					}
				break;
				case target.className == "first":
					// 非运动
					// that.ul.style.left = 0;
					// 运动
					that.ul.animate([
						{left: getComputedStyle(that.ul,null).left},
						{left: "0px"}
					],{
						duration: 100,
						fill: "forwards",
						easing: "ease-in"
					});
					that.changeActive(that.options.currentPage = 0);
				break;
				case target.className == "last":
					// 非运动
					// that.ul.style.left = -(that.options.pages - that.options.showItems)*li_w + "px";
					// 运动
					that.ul.animate([
						{left: getComputedStyle(that.ul,null).left},
						{left: -(that.options.pages - that.options.showItems)*that.li_w + "px"}
					],{
						duration: 100,
						fill: "forwards",
						easing: "ease-in"
					});
					that.changeActive(that.options.currentPage = that.options.pages - 1);
				break;
			}
		}
	},
	Page.prototype.changeActive = function(){
		for(var i=0;i<this.lis.length;i++){
			this.lis[i].className = i == this.options.currentPage ? "active" : "";
		}
	},
	Page.prototype.changePage = function(){
		var that = this;
		that.changeActive(that.options.currentPage);
		
		if(that.options.currentPage >= Math.floor(that.options.showItems/2) && that.options.currentPage < that.options.pages - Math.floor(that.options.showItems/2)){
			// 非运动
			// that.ul.style.left = -(that.options.currentPage - Math.floor(that.options.showItems/2))*that.li_w + "px";
			// 运动
			that.ul.animate([
				{left: getComputedStyle(that.ul,null).left},
				{left: -(that.options.currentPage - Math.floor(that.options.showItems/2))*that.li_w + "px"}
			],{
				duration: 100,
				fill: "forwards",
				easing: "ease-in"
			});
		}
	},
	Page.prototype.setButton = function(){
		console.log(this);
	}

	window.Page = Page;
})(window,undefined)