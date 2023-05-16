/* eslint-disable */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import Tree from 'rc-tree';
import assign from 'object-assign';
import { ClickAwayListener } from "@material-ui/core";

const TreeView = ({
    treeData = [],
    selectedNodes,
    onSelect,
    className,
    defaultExpandAll,
    contextMenus,
    contextMenuKey,
    onContextMenuClick,
    ...rest
}) => {
    const [expandedNodes, setExpandedNodes] = useState([]);
    const [updateView, setUpdateView] = useState(false)

    const recursive = (children = [], resultKeys = []) => {
        if (children && children.length > 0) {
            for (let c = 0; c < children.length; c++) {
                const child = children[c];
                if (child.children && child.children.length > 0) {
                    const childKeys = recursive(child.children, resultKeys);
                    resultKeys.push(child.key)
                    resultKeys = resultKeys.concat(childKeys)
                    resultKeys = [...new Set(resultKeys)]
                } else {
                    resultKeys.push(child.key);
                }
            }
        }
        return resultKeys;
    }

    useEffect(() => {
        const keys = recursive(treeData, []);
        setExpandedNodes(keys);
        getContainer()

        setUpdateView(!updateView)

    }, [treeData]);

    const getContainer = () => {
        const id = 'tree-contextmenu-wrapper';
        const domContainer = document.getElementById(id);
        if (domContainer) {
            return domContainer;
        } else {
            const domContainer = document.createElement('div');
            domContainer.id = id;
            document.body.appendChild(domContainer);
            return domContainer;
        }
    }

    const unMountContextMenus = () => {
        const wrapper = getContainer();
        if (wrapper) {
            ReactDOM.unmountComponentAtNode(wrapper);
        }
    }

    const onRightClick = (info, node) => {
        if (info) {
            if (!info.node?.disableContextMenu) {
                if (contextMenus && (contextMenus.length > 0 || Object.values(contextMenus).length > 0)) {
                    if (info.node && info.node.key && info.node.key in contextMenus) {
                        contextMenus = contextMenus[info.node.key];
                    }

                    let tooltipVisible = true;
                    let menuItems = contextMenus[contextMenuKey];

                    if (menuItems && menuItems.length > 0) {
                        const menuRenderViews = (
                            <ClickAwayListener onClickAway={unMountContextMenus}>
                                <div
                                    className='react-contextmenu'
                                >
                                    {
                                        menuItems.map(menu => {
                                            return (
                                                <div
                                                    key={"cm_" + info.node.key + "_item_" + menu.key}
                                                    className="react-contextmenu-item"
                                                    role="menuitem"
                                                    onClick={() => {
                                                        tooltipVisible = false;
                                                        contextMenuClickHandler(info.node.key, menu.key);
                                                        unMountContextMenus()
                                                    }}
                                                >
                                                    <i className={'m-nav__link-icon ' + menu.iconClassName} />
                                                    <span className="m-nav__link-text">{menu.text}</span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </ClickAwayListener>
                        );

                        const container = getContainer();
                        assign(container.style, {
                            position: 'absolute',
                            left: `${info.event.pageX}px`,
                            top: `${info.event.pageY}px`,
                        });

                        ReactDOM.render(menuRenderViews, container);
                    }
                } else {
                    return null;
                }
            }
        }
    };

    const contextMenuClickHandler = (key, menuKey) => {
        onContextMenuClick(key, menuKey);
    }

    if (treeData?.length) {
        return (
            <Tree
                onRightClick={onRightClick}
                showIcon={false}
                showLine="true"
                treeData={treeData}
                defaultExpandedKeys={expandedNodes}
                selectedKeys={selectedNodes}
                autoExpandParent="true"
                defaultExpandParent="true"
                onSelect={onSelect}
                defaultExpandAll={true}
                className={className}
                {...rest}
            />
        )
    }

    return (
        '...'
    )
}

export default TreeView;