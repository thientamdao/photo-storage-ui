import { createStore } from 'redux'

const initialState = {
  userInfo: {},
  selectedImages: [],
  isSelectAll: -1,
  atHomeRoute: true,
  uploadResponse: null,
  setImagePreview: null,
  imagesChange: true,
  imagesPreview: [],
  decryptRequests: [],
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOG_IN': {
      return { ...state, userInfo: action.userInfo }
    }

    case 'LOG_OUT': {
      return initialState
    }

    case 'SELECT_IMG': {
      const newSelectedImages = [...state.selectedImages]
      newSelectedImages.push(action.imgId)

      return { ...state, selectedImages: newSelectedImages }
    }

    case 'UNSELECT_IMG': {
      const newSelectedImages = [...state.selectedImages]
      newSelectedImages.splice(newSelectedImages.indexOf(action.imgId), 1)

      return { ...state, selectedImages: newSelectedImages }
    }

    case 'SELECT_ALL': {
      return { ...state, isSelectAll: action.checked }
    }

    case 'HOME_ROUTE': {
      return { ...state, atHomeRoute: action.atHomeRoute }
    }

    case 'UPLOAD_RESPONSE': {
      return { ...state, uploadResponse: action.uploadResponse }
    }

    case 'SET_IMAGE_PREVIEW': {
      return { ...state, setImagePreview: !state.setImagePreview }
    }

    case 'IMAGES_CHANGE': {
      return { ...state, imagesChange: !state.imagesChange }
    }

    case 'ADD_IMAGE_PREVIEW': {
      const newImagesPreview = [...state.imagesPreview]
      newImagesPreview.push(action.imagePreview)

      return { ...state, imagesPreview: newImagesPreview }
    }

    case 'ADD_DECRYPT_REQUEST': {
      const newDecryptRequests = [...state.decryptRequests, action.imageId]
      // newImagesPreview.push(action.imagePreview)

      return { ...state, decryptRequests: newDecryptRequests }
    }

    case 'REMOVE_IMAGE_PREVIEW': {
      // const newImagesPreview = state.imagesPreview.filter((imagePreview) => imagePreview.id !== action.id)
      const newImagesPreview = []
      for (let i = 0; i < state.imagesPreview.length; i++) {
        if (state.imagesPreview[i].id !== action.id) {
          newImagesPreview.push(state.imagesPreview[i])
        } else {
          URL.revokeObjectURL(state.imagesPreview[i].url)
        }
      }
      return { ...state, imagesPreview: newImagesPreview }
    }

    default:
      return state
  }
}

const store = createStore(reducer)
export default store
