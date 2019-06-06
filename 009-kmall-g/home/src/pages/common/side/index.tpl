{{#list}}
{{#isActive}}
<li class="side-item active">
	<a class="link" href="{{href}}">{{desc}}</a>
</li>
{{/isActive}}
{{^isActive}}
<li class="side-item">
	<a class="link" href="{{href}}">{{desc}}</a>
</li>
{{/isActive}}
{{/list}}