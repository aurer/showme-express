var forms = document.querySelectorAll('form');
for (i = 0; i < forms.length; i++) {
	make(forms[i]);
};

function make(form) {
	if (form.getAttribute('data-prev-action') == null) {
		if (form.getAttribute('action')) {
			var querystring = form.getAttribute('action').split('?')[1] || null;
			form.setAttribute('data-prev-action', form.getAttribute('action'));
			form.action='https://showme.aurer.co.uk' + (querystring ? '?' + querystring : '');
		} else {
			form.setAttribute('data-prev-action', window.location.origin + window.location.pathname);
			form.action='https://showme.aurer.co.uk' + (window.location.search ? '?' + window.location.search : '');
		}
		form.target = '_blank';
		form.style.outline = '1px solid #75d5ff';
		form.style.boxShadow = ' 0 0 15px 4px #1BA5E0';
		var e = document.createElement('input');
		e.type = 'hidden';
		e.name = 'formSubmitsTo';
		e.value = form.getAttribute('data-prev-action');
		form.appendChild(e);
	} else {
		unmake(form);
	}
};

function unmake(form) {
	form.action = form.getAttribute('data-prev-action');
	form.removeAttribute('data-prev-action');
	form.removeAttribute('target');
	form.style.outline = 'none';
	form.style.boxShadow = 'none';
	form.querySelector('input[name="formSubmitsTo"]').remove;
};
