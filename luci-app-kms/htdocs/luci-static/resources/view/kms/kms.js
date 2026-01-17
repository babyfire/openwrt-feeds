/*
 * Copyright (C) 2025-2026 BabyFire <babyfire@email.com>
 *
 * Licensed to the public under the GPL V3 License.
 */

'use strict';
'require fs';
'require view';
'require form';
'require uci';
'require poll';
'require rpc';

var pkgName = 'kms';
var logPath = '/var/log/kms.log';

const callServiceList = rpc.declare({
    object: 'service',
    method: 'list',
    params: ['name']
});

function renderStatusHTML(isRunning) {
    var label = isRunning ? _('RUNNING') : _('NOT RUNNING');
    var color = isRunning ? 'green' : 'red';
    return E('span', { 'style': 'color:' + color + ';font-weight:bold' }, [
        _('KMS'), ' - ', label
    ]);
}

return view.extend({
    load: function () {
        return Promise.all([
            uci.load(pkgName),
            fs.read(logPath).catch(function (e) { return ''; })
        ]);
    },

    render: function (data) {
        let m, s, o;

        m = new form.Map(pkgName, _('KMS'), _('Key Management Service'));

        // --- 状态栏 ---
        s = m.section(form.NamedSection, 'config', 'config');
        s.anonymous = true;
        s.render = function (section_id) {
            poll.add(L.bind(function () {
                return callServiceList({ name: pkgName }).then(function (res) {
                    var node = document.getElementById('service_status');
                    if (node) {
                        var isRunning = false;
                        if (res && res[pkgName] && res[pkgName].instances) {
                            isRunning = Object.keys(res[pkgName].instances).length > 0;
                        }
                        node.innerHTML = '';
                        node.appendChild(renderStatusHTML(isRunning));
                    }
                }).catch(function (e) { });
            }, this), 5);

            return E('div', { 'class': 'cbi-section-node' }, [
                E('div', { 'class': 'cbi-value', 'id': 'service_status', 'style': 'padding:10px' }, [_('Collecting data ...')])
            ]);
        };

        // --- 设置面板 ---
        s = m.section(form.NamedSection, 'config', 'config', _('Settings'));
        s.anonymous = false;
        s.addremove = false;

        s.tab("settings", _("General Settings"));
        s.tab("log", _('Log'));

        o = s.taboption("settings", form.Flag, "enabled", _("Enable"));
        o.rmempty = false;
        o = s.taboption("settings", form.Flag, "auto_activate", _("Auto activate"));
        o.default = '1';
        o = s.taboption("settings", form.Value, "listen", _("Listen"));
        o.datatype = 'ip4addr';
        o.placeholder = '0.0.0.0';
        o = s.taboption("settings", form.Value, "port", _("Port"));
        o.datatype = 'port';
        o.placeholder = '1688';
        o = s.taboption("settings", form.Flag, "log_verbose", _("Log Verbose"));
        o = s.taboption("settings", form.Flag, "syslog", _("syslog"));

        // --- 日志页签 (解决全选与无法滚动问题) ---
        o = s.taboption("log", form.TextValue, _("log_view"));
        o.rows = 25;
        o.wrap = false;
        o.rmempty = true;
        // 关键：禁止自动获取焦点
        o.attributes = {
            'readonly': 'readonly',
            'wrap': 'off',
            'spellcheck': 'false'
        };

        o.load = function (section_id) {
            return data[1] || _('No log data available.');
        };
        o.write = function (section_id, formvalue) {
            return true;
        };

        // 核心更新逻辑：修复自动全选
        poll.add(L.bind(function () {
            const option = this;
            return fs.read(logPath).then(function (res) {
                var content = res ? res.trim() : '';
                var uiElem = option.getUIElement('config');
                if (uiElem && uiElem.node) {
                    var textarea = uiElem.node.querySelector('textarea');
                    if (textarea) {
                        // 1. 如果内容没变，直接跳过，防止干扰用户选中操作
                        if (textarea.value === content) return;

                        // 2. 记录当前滚动位置和是否在底部
                        var isAtBottom = (textarea.scrollHeight - textarea.clientHeight - textarea.scrollTop) < 50;

                        // 3. 使用直接赋值代替 setValue，避免触发 LuCI 的全选逻辑
                        textarea.value = content;

                        // 4. 显式清除选中状态，防止变成全选高亮
                        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
                        textarea.blur(); // 强制失去焦点，防止被系统选中

                        // 5. 自动滚动逻辑
                        if (isAtBottom) {
                            textarea.scrollTop = textarea.scrollHeight;
                        }
                    }
                }
            }).catch(function (e) { });
        }, o), 5);

        // 注入全局样式：修复灰色背景并允许滚动
        var style = document.createElement('style');
        style.innerHTML = `
            textarea[name="cbid.kms.config._log_view"] {
                background-color: #fff !important;
                color: #333 !important;
                overflow: auto !important;
                cursor: text !important;
                user-select: text !important;
                -webkit-user-select: text !important;
                outline: none !important;
            }
            textarea[name="cbid.kms.config._log_view"]:focus {
                box-shadow: none !important;
                border-color: #ccc !important;
            }
        `;
        document.head.appendChild(style);

        return m.render();
    }
});
