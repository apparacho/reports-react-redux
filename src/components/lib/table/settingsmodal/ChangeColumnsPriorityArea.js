import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import dndImg from '../../icon/dnd.png';

const ColumnItem = ({ item, index }) => (
    <Draggable draggableId={item.dataIndex} index={index}>
        {provided => (
            <div className="change-columns-priority-area-item"
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
            >
                <img src={dndImg} className="change-columns-priority-area-item-img" />
                <span>{item.titleText}</span>
            </div>
        )}
    </Draggable>
);


class ChangeColumnsPriorityArea extends Component {
    static propTypes = {}

    onDragEnd = result => {
        const { destination, source } = result;
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }

        const newItems = this.props.items.slice(),
            sourceItem = newItems.splice(source.index, 1)[0];
        newItems.splice(destination.index, 0, sourceItem);

        this.props.onChange && this.props.onChange(newItems);
    };

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId={Date.now()}>
                    {provided => (
                        <div style={{overflow: 'hidden'}} ref={provided.innerRef} {...provided.droppableProps}>
                            {this.props.items.map((col, index) =>
                                <ColumnItem className="change-columns-priority-area-item" item={col} key={col.dataIndex} index={index} />
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}

export default ChangeColumnsPriorityArea;
