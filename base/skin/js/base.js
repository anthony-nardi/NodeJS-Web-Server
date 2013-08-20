if (document.addEventListener) {

	document.addEventListener('DOMContentLoaded', function () {
		
		console.log('Document Loaded.');
		
		(function () {
			
			var navItems = document.getElementsByClassName('navItem'),
					navList  = document.getElementById('navList'),
					totalWidth = 20;
			
			for (var i = 0; i < navItems.length; i += 1) {
				totalWidth += navItems[i].offsetWidth;
			}

			navList.style.width = totalWidth + 'px';

		}());
	
	}, false);

}