import "./style.css";
import { Grid, GridRowModel, AjaxStore } from "@bryntum/grid";

const memberStore = new AjaxStore({
  readUrl: "/members.json",
});

const status = [
  {
    label: "Failed",
    color: "#e74c3c",
  },
  {
    label: "Passed",
    color: "#3498db",
  },
];

const getAvatars = (id) => {
  const member = memberStore.getById(id);

  return member
    ? {
        class: "avatar",
        elementData: member,
        style: `background: url(/users/${member.photo});background-position: center;background-size: contain; `,
      }
    : "";
  // TODO: Make above in CSS
};

class Student extends GridRowModel {
  static fields = ["id", "name", "semester", "total"];

  // must match with the column's 'field' value
  get total() {
    return this.marks.reduce((acc, r) => acc + r.marks, 0);
  }

  get remarks() {
    let currentStatus = status[1];
    this.marks.map((marks) => {
      if (marks.marks < 50) {
        currentStatus = status[0];
      }
    });
    return {
      class: "badge",
      style: {
        backgroundColor: currentStatus.color,
      },
      text: currentStatus.label,
    };
  }
}

const marksGridConfig = {
  type: "grid",
  cls: "inner-grid",
  autoHeight: true,
  columns: [
    {
      text: "Subject",
      field: "subject",
      icon: "b-fa b-fa-book",
      flex: 1,
    },
    {
      text: "Marks",
      field: "marks",
      icon: "b-fa b-fa-graduation-cap",
      flex: 1,
      htmlEncode: false,
      renderer({ value, cellElement }) {
        cellElement.style.color = value < 50 ? "#e53f2c" : "#000000";
        return value;
      },
    },
  ],
};

const grid = new Grid({
  appendTo: "app",

  store: {
    readUrl: "data.json",
    autoLoad: true,
    modelClass: Student,
    listeners: {
      async load() {
        await memberStore.load();
        grid.refreshRows?.();
      },
    },
  },
  features: {
    rowExpander: {
      widget: marksGridConfig,
      dataField: "marks",
    },
  },

  columns: [
    {
      text: "Student",
      field: "name",
      icon: "b-fa b-fa-user",
      flex: "1",
      renderer({ record, value }) {
        return {
          class: "name-container",
          children: [getAvatars(record.imageid), { html: value }],
        };
      },
    },
    {
      text: "Semester",
      field: "semester",
      icon: "b-fa b-fa-landmark",
      flex: 1,
    },
    {
      text: "Total Marks",
      field: "total",
      icon: "b-fa b-fa-graduation-cap",
      flex: 1,
    },
    {
      text: "Remarks",
      field: "remarks",
      icon: "b-fa b-fa-gavel",
      flex: 1,
    },
  ],
});
