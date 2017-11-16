import {
  Namespace,
  pending,
  resolved,
  rejected,
  Service,
} from './utils'

@Namespace('/linkedSheets')
class LinkedSheets extends Service {
  state = {
    showAll: pending([]),
    addProcess: resolved(null),
    deleteProcess: resolved(null),
  }
  type = {
    FETCHED_SHEETS_LIST: Symbol('LinkedSheet::Fetch sheets'),
    ADD_LINKED_SHEET: Symbol('LinkedSheet::Add linked sheet'),
    UNLINK_SHEET: Symbol('LinkedSheet::Unlink sheet'),
  }
  async fetchLinkedSheets() {
    // Mark status of showAll as "pending"
    // { showAll: { status: "pending", value: [] } }
    this.dispatchAs(this.type.FETCHED_SHEETS_LIST, {
      showAll: pending([]),
    })

    this.askServer('fetchLinkedSheets', null, (answer) => {
      if (answer.hasError) {
        // Mark status of showAll as "rejected"
        // { showAll: { status: "rejected", value: [] } }
        this.dispatchAs(this.type.FETCHED_SHEETS_LIST, {
          showAll: rejected({}),
        })
      } else {
        // Mark status of showAll as resolved
        // { showAll: { status: "resolved", value: [...,{ LinkedSheet }] } }
        this.dispatchAs(this.type.FETCHED_SHEETS_LIST, {
          showAll: resolved(
            answer.linkedSheetsList.map(LinkedSheet => ({
              Name: LinkedSheet[0],
              SpreadsheetID: LinkedSheet[1],
              Original: LinkedSheet[2],
            })),
          ),
        })
      }
    })
  }

  async addLinkedSheet(form) {
    const {
      data,
      replyForm,
      changeState,
    } = form

    this.dispatchAs(this.type.ADD_LINKED_SHEET, {
      showAll: pending([]),
      addProcess: pending(data),
    })

    this.askServer('addLinkedSheet', data, (answer) => {
      if (answer.hasError) {
        replyForm(
          answer.generalError, // Display in ServiceForm.Alert
          answer.fieldErrors, // Display in Inputs (Done Automatically)
        )
      } else {
        changeState('done!')
        this.fetchLinkedSheets()
      }
    })
  }

  async unlinkSheet(data) {
    this.dispatchAs(this.type.UNLINK_SHEET, {
      deleteProcess: pending(data),
    })
    this.askServer('unlinkSheet', data, (answer) => {
      if (answer.hasError) {
        // Mark as { deleteProcess: { status: 'rejected', value: [ERROR] } }
        this.dispatchAs(this.type.UNLINK_SHEET, {
          deleteProcess: rejected(answer.generalError),
        })
      } else {
        // Mark as { deleteProcess: { status: 'resolved', value: [linkedSheetId] } }
        this.dispatchAs(this.type.UNLINK_SHEET, {
          deleteProcess: resolved(data),
        })
        // We set to null, so Component won't display the message box again when
        // It updates the next time (this is the initial state of deleteProcess)
        this.dispatchAs(this.type.UNLINK_SHEET, {
          deleteProcess: resolved(null),
        })
        this.fetchLinkedSheets()
      }
    })
  }
}

export default new LinkedSheets()
