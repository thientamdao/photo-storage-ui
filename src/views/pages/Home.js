import { cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CAvatar, CButton, CCard, CCardBody, CCardImage, CCardTitle, CCol, CContainer, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CFormInput, CModal, CModalBody, CModalHeader, CModalTitle, CRow, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CTooltip } from '@coreui/react'
import { faCheck, faChevronLeft, faChevronRight, faCircleInfo, faDownload, faEllipsis, faShare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import axios from '../../axios'

function Home() {
  console.log('home render')

  const dispatch = useDispatch()

  const decryptRequests = useSelector((state) => state.decryptRequests)
  const setImagePreview = useSelector((state) => state.setImagePreview)
  const atHomeRoute = useSelector((state) => state.atHomeRoute)
  const imagesChange = useSelector((state) => state.imagesChange)
  const selectedImages = useSelector((state) => state.selectedImages)
  const isSelectAll = useSelector((state) => state.isSelectAll)
  const imagesPreview = useSelector((state) => state.imagesPreview)

  const [visible, setVisible] = useState(false)
  const [shareVisible, setShareVisible] = useState(false)
  const [images, setImages] = useState([])
  const [imageIndex, setImageIndex] = useState(0)

  console.log('imagesPreview', imagesPreview)
  console.log('images', images)

  const inputElements = [...document.querySelectorAll('input[name="my-storage"]')]
  if (isSelectAll === true) {
    // eslint-disable-next-line
    inputElements.map((inputElement) => {
      if (!inputElement.checked) {
        inputElement.checked = true
        dispatch({ type: 'SELECT_IMG', imgId: inputElement.id })
      }
    })
  } else if (isSelectAll === false) {
    // eslint-disable-next-line
    inputElements.map((inputElement) => {
      if (inputElement.checked) {
        inputElement.checked = false
        dispatch({ type: 'UNSELECT_IMG', imgId: inputElement.id })
      }
    })
    dispatch({ type: 'SELECT_ALL', checked: -1 })
  }

  useEffect(() => {
    if (atHomeRoute) {
      axios.get('/image', { headers: { Authorization: 'Bearer ' + localStorage.accessToken } }).then((res) => {
        setImages(res.data)
      })
    } else {
      axios.get('/image?type=Shared', { headers: { Authorization: 'Bearer ' + localStorage.accessToken } }).then((res) => {
        setImages(res.data)
      })
    }
    // eslint-disable-next-line
  }, [imagesChange])

  useEffect(() => {
    if (atHomeRoute) {
      axios.get('/image', { headers: { Authorization: 'Bearer ' + localStorage.accessToken } }).then((res) => {
        setImages(res.data)
      })
    } else {
      axios.get('/image?type=Shared', { headers: { Authorization: 'Bearer ' + localStorage.accessToken } }).then((res) => {
        setImages(res.data)
      })
    }
    // eslint-disable-next-line
  }, [atHomeRoute])

  useEffect(() => {
    for (let i = 0; i < images.length; i++) {
      if (images[i].preview === undefined) {
        for (let j = 0; j < imagesPreview.length; j++) {
          if (images[i].pictureId === imagesPreview[j].id) {
            images[i].preview = imagesPreview[j].url
            setImages([...images])
            break
          }
        }
      }
    }
    // eslint-disable-next-line
  }, [setImagePreview])

  useEffect(() => {
    for (let i = 0; i < images.length; i++) {
      if (images[i].preview === undefined) {
        for (let j = 0; j < imagesPreview.length; j++) {
          if (images[i].pictureId === imagesPreview[j].id) {
            images[i].preview = imagesPreview[j].url
            setImages([...images])
            break
          }
        }

        if (images[i].preview === undefined) {
          const requested = decryptRequests.includes(images[i].pictureId)
          if (!requested) {
            console.log('giai ma', images[i].picture.name)
            dispatch({ type: 'ADD_DECRYPT_REQUEST', imageId: images[i].pictureId })

            axios.post(`/image/decrypt-image/${images[i].pictureId}`, { password: localStorage.pwd }, { headers: { Authorization: 'Bearer ' + localStorage.accessToken } }).then((buffer) => {
              const arrayBufferView = new Uint8Array(Object.values(buffer.data))
              const blob = new Blob([arrayBufferView], { type: 'image/png' })
              const url = URL.createObjectURL(blob)

              dispatch({ type: 'ADD_IMAGE_PREVIEW', imagePreview: { id: images[i].pictureId, url: url } })
              dispatch({ type: 'SET_IMAGE_PREVIEW' })
            })
          }
        }
      }
    }
    // eslint-disable-next-line
  }, [images])

  return (
    <>
      {images[imageIndex] ? (
        <CModal fullscreen visible={visible} onClose={() => setVisible(false)}>
          <CRow className="flex-1 mxh-100 g-0">
            <CCol xs={12} sm={6} md={7} xl={8} xxl={9} className="bg-dark mxh-100 d-flex align-items-center justify-content-center position-relative my-overlay">
              <CSpinner className={images[imageIndex].preview ? 'd-none' : 'position-absolute'} variant="grow" />
              <img className="mxh-100" style={images[imageIndex].preview ? {} : { opacity: 0.4 }} src={images[imageIndex].preview ? images[imageIndex].preview : images[imageIndex].path} alt="Loading file fail" />

              <CTooltip content="Press Esc to close" placement="bottom">
                <CButton shape="rounded-pill" color="dark" className="position-absolute p-2 btn-close-image my-overlay-item" onClick={() => setVisible(false)}>
                  <CIcon icon={cilX} size="xl" className="d-block" />
                </CButton>
              </CTooltip>

              <CButton
                size="lg"
                shape="rounded-pill"
                color="light"
                className={imageIndex === 0 ? 'd-none' : 'position-absolute btn-previous-image my-overlay-item'}
                onClick={() => {
                  setImageIndex(imageIndex - 1)
                }}
              >
                <FontAwesomeIcon icon={faChevronLeft} className="fs-15" />
              </CButton>

              <CButton
                size="lg"
                shape="rounded-pill"
                color="light"
                className={imageIndex === images.length - 1 ? 'd-none' : 'position-absolute btn-after-image my-overlay-item'}
                onClick={() => {
                  setImageIndex(imageIndex + 1)
                }}
              >
                <FontAwesomeIcon icon={faChevronRight} className="fs-15" />
              </CButton>
            </CCol>

            <CCol xs={12} sm={6} md={5} xl={4} xxl={3} className="bg-light p-3 image-info">
              <CRow className="g-0 align-items-center justify-content-between mb-3">
                <CCol xs={'auto'}>
                  <CRow className="g-0 align-items-center">
                    <CCol xs={'auto'} className="me-2">
                      <CAvatar color="secondary" size="md">
                        {`${images[imageIndex].author.firstName[0]}${images[imageIndex].author.lastName[0]}`}
                      </CAvatar>
                    </CCol>
                    <CCol xs={'auto'}>
                      <p className="h6 m-0">{`${images[imageIndex].author.firstName} ${images[imageIndex].author.lastName}`}</p>
                      <small className="m-0 text-dark fw-normal">{new Date(images[imageIndex].picture.updatedAt).toLocaleString()}</small>
                    </CCol>
                  </CRow>
                </CCol>
                <CCol xs={'auto'}>
                  <CDropdown
                    placement="bottom-end"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <CDropdownToggle size="sm" color="secondary" variant="ghost" shape="rounded-pill" caret={false} style={{ fontSize: '20px', lineHeight: '25.5px' }}>
                      <FontAwesomeIcon icon={faEllipsis} />
                    </CDropdownToggle>
                    <CDropdownMenu className="mt-1 box-shadow-lg">
                      <CDropdownItem disabled={!images[imageIndex].preview} className="py-2" style={{ cursor: 'pointer' }} onClick={() => setShareVisible(true)}>
                        <CModal visible={shareVisible} onClose={() => setShareVisible(false)}>
                          <CModalHeader onClose={() => setShareVisible(false)}>
                            <CModalTitle>Share "{images[imageIndex].picture.name}" to</CModalTitle>
                          </CModalHeader>
                          <CModalBody>
                            <div className="d-flex">
                              <CFormInput type="text" placeholder="Email" id="email" />
                              <CButton
                                className="ms-2"
                                color="primary"
                                onClick={async () => {
                                  const email = document.querySelector('#email').value
                                  try {
                                    await axios.post(`/image/share-image/${images[imageIndex].pictureId}`, { password: localStorage.pwd, email }, { headers: { Authorization: 'Bearer ' + localStorage.accessToken } })
                                    toast.success(`Share ${images[imageIndex].picture.name} to ${email} successfully`, { autoClose: 3000 })
                                  } catch (error) {
                                    toast.error(error.response.data.message, { autoClose: 3000 })
                                  }
                                }}
                              >
                                Share
                              </CButton>
                            </div>
                          </CModalBody>
                        </CModal>

                        <CRow className="w-max g-0">
                          <CCol xs={'auto'} className="me-3">
                            <FontAwesomeIcon icon={faShare} className="fs-6" />
                          </CCol>
                          <CCol xs={'auto'}>
                            <p className="h6 m-0">Share</p>
                            <small className="m-0 fw-normal">Share this photo to your friend</small>
                          </CCol>
                        </CRow>
                      </CDropdownItem>

                      <CDropdownItem
                        className="py-2"
                        style={{ cursor: 'pointer' }}
                        onClick={async () => {
                          try {
                            await axios.delete(`/image/${images[imageIndex].picture.id}`, { headers: { Authorization: 'Bearer ' + localStorage.accessToken } })
                            toast.success('Delete Successfully', { autoClose: 3000 })
                            dispatch({ type: 'REMOVE_IMAGE_PREVIEW', id: images[imageIndex].pictureId })
                          } catch (error) {
                            toast.error(error.response.data.message, { autoClose: 3000 })
                          }
                          dispatch({ type: 'IMAGES_CHANGE' })
                        }}
                      >
                        <CRow className="w-max g-0">
                          <CCol xs={'auto'} className="me-3">
                            <FontAwesomeIcon icon={faTrash} className="fs-6" />
                          </CCol>
                          <CCol xs={'auto'}>
                            <p className="h6 m-0">Delete</p>
                            <small className="m-0 fw-normal">You cannot undo this action</small>
                          </CCol>
                        </CRow>
                      </CDropdownItem>

                      <CDropdownItem disabled={!images[imageIndex].preview} href={images[imageIndex].preview} className="py-2" download={images[imageIndex].picture.name}>
                        <CRow className="w-max g-0">
                          <CCol xs={'auto'} className="me-3">
                            <FontAwesomeIcon icon={faDownload} className="fs-6" />
                          </CCol>
                          <CCol xs={'auto'}>
                            <p className="h6 m-0">Download</p>
                            <small className="m-0 fw-normal">Download this photo</small>
                          </CCol>
                        </CRow>
                      </CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CCol>
              </CRow>

              <CRow>
                <CCol>
                  <CCard>
                    <CCardImage orientation="top" src={images[imageIndex].path} />
                    <CCardBody>
                      <CCardTitle>How this picture looks on the server</CCardTitle>
                      <CTable className="table-fluid">
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell scope="row" colSpan={2} className="fw-bolder" style={{ fontSize: '18px' }}>
                              <FontAwesomeIcon icon={faCircleInfo} /> Information
                            </CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          <CTableRow>
                            <CTableHeaderCell scope="row">Name</CTableHeaderCell>
                            <CTableDataCell>{images[imageIndex].picture.name}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell scope="row">Image ID</CTableHeaderCell>
                            <CTableDataCell>{images[imageIndex].picture.id}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell scope="row">Dimensions</CTableHeaderCell>
                            <CTableDataCell>{`${images[imageIndex].picture.width} x ${images[imageIndex].picture.height} pixels`}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell scope="row">Item type</CTableHeaderCell>
                            <CTableDataCell>{images[imageIndex].picture.type}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell scope="row">Size</CTableHeaderCell>
                            <CTableDataCell>{`${Number(images[imageIndex].picture.size / 1024).toFixed(1)} KB (${images[imageIndex].picture.size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} bytes)`}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell scope="row">Author</CTableHeaderCell>
                            <CTableDataCell>{images[imageIndex].author.email}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell scope="row">Date created</CTableHeaderCell>
                            <CTableDataCell>{new Date(images[imageIndex].picture.createdAt).toLocaleString()}</CTableDataCell>
                          </CTableRow>
                        </CTableBody>
                      </CTable>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CCol>
          </CRow>
        </CModal>
      ) : images[imageIndex - 1] ? (
        setImageIndex(imageIndex - 1)
      ) : (
        <></>
      )}

      <CContainer fluid>
        <div className="masonry">
          {images.map((image, index) => (
            <CCard
              key={index}
              className="masonry-item hover-overlay"
              onClick={(e) => {
                if (selectedImages.length === 0) {
                  setImageIndex(index)
                  setVisible(true)
                } else {
                  const inputElement = e.target.querySelector('input')
                  inputElement.checked = !inputElement.checked

                  // The change by js cannot trigger onchange event, so do it manually
                  if (inputElement.checked) {
                    dispatch({ type: 'SELECT_IMG', imgId: image.pictureId })
                    if (images.length === selectedImages.length + 1) {
                      dispatch({ type: 'SELECT_ALL', checked: true })
                    }
                  } else {
                    dispatch({ type: 'UNSELECT_IMG', imgId: image.pictureId })
                    if (images.length === selectedImages.length) {
                      dispatch({ type: 'SELECT_ALL', checked: -1 })
                    }
                  }
                }
              }}
            >
              <CSpinner className={image.preview ? 'd-none' : 'position-absolute'} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} variant="grow" />
              <CCardImage orientation="top" src={image.preview ? image.preview : image.path} style={selectedImages.length === 0 ? (image.preview ? {} : { opacity: 0.4 }) : { opacity: 0.6 }} />

              <div className="card-img-overlay text-end" style={selectedImages.length === 0 ? {} : { display: 'block' }}>
                <input
                  className="btn-check"
                  type="checkbox"
                  id={image.pictureId}
                  name="my-storage"
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    if (e.target.checked) {
                      dispatch({ type: 'SELECT_IMG', imgId: image.pictureId })
                      if (images.length === selectedImages.length + 1) {
                        dispatch({ type: 'SELECT_ALL', checked: true })
                      }
                    } else {
                      dispatch({ type: 'UNSELECT_IMG', imgId: image.pictureId })
                      if (images.length === selectedImages.length) {
                        dispatch({ type: 'SELECT_ALL', checked: -1 })
                      }
                    }
                  }}
                />

                <label className="btn btn-outline-primary btn-sm rounded-pill" htmlFor={image.pictureId} onClick={(e) => e.stopPropagation()}>
                  {<FontAwesomeIcon icon={faCheck} className="fs-6" />}
                </label>
              </div>

              <CCardBody>
                <CCardTitle className="fs-6 m-0">{image.picture.name}</CCardTitle>
              </CCardBody>
            </CCard>
          ))}
        </div>
      </CContainer>
    </>
  )
}

export default Home
