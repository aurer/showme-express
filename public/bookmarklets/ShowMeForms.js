javascript:(function(){var forms=document.querySelectorAll("form");for(i=0;i<forms.length;i++)make(forms[i]);function make(t){if(null==t.getAttribute("data-prev-action")){if(t.getAttribute("action")){var e=t.getAttribute("action").split("?")[1]||null;t.setAttribute("data-prev-action",t.getAttribute("action")),t.action="https://showme.aurer.dev"+(e?"?"+e:"")}else t.setAttribute("data-prev-action",window.location.origin+window.location.pathname),t.action="https://showme.aurer.dev"+(window.location.search?"?"+window.location.search:"");t.setAttribute("novalidate",!0),t.target="_blank",t.style.outline="1px solid #75d5ff",t.style.boxShadow=" 0 0 15px 4px #1BA5E0";var o=document.createElement("input");o.type="hidden",o.name="formSubmitsTo",o.value=t.getAttribute("data-prev-action"),t.appendChild(o)}else unmake(t)}function unmake(t){t.action=t.getAttribute("data-prev-action"),t.removeAttribute("data-prev-action"),t.removeAttribute("target"),t.removeAttribute("novalidate"),t.style.outline="none",t.style.boxShadow="none",t.querySelector('input[name="formSubmitsTo"]').remove}})();