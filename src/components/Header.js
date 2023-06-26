import { cilInfo } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CAlert, CAvatar, CButton, CButtonGroup, CCard, CCardBody, CCardImage, CCardTitle, CCloseButton, CCol, CContainer, CDropdown, CDropdownMenu, CDropdownToggle, CFormCheck, CFormInput, CHeader, CHeaderBrand, CHeaderNav, CModal, CModalBody, CModalHeader, CModalTitle, CRow, CSpinner } from '@coreui/react'
import { faCheck, faDiceD6, faDownload, faGear, faHouse, faRightFromBracket, faShare, faStore, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import axios from '../axios'

function Header() {
  console.log('header render')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const params = useLocation().pathname.split('/')
  const atHomeRoute = params[params.length - 1] === ''
  dispatch({ type: 'HOME_ROUTE', atHomeRoute: atHomeRoute })

  const uploadResponse = useSelector((state) => state.uploadResponse)
  const userInfo = useSelector((state) => state.userInfo)
  const selectedImages = useSelector((state) => state.selectedImages)
  const isSelectAll = useSelector((state) => state.isSelectAll)
  const imagesPreview = useSelector((state) => state.imagesPreview)

  const [visible, setVisible] = useState(false)
  const [files, setFiles] = useState([])
  const [drag, setDrag] = useState(false)
  const [shareVisible, setShareVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.accessToken) {
      navigate('/login')
    }
    // eslint-disable-next-line
  }, [userInfo])

  useEffect(() => {
    const getSelfInfo = async () => {
      if (!localStorage.accessToken) {
        navigate('/login')
      } else {
        try {
          const res = await axios.get('/user', { headers: { Authorization: 'Bearer ' + localStorage.accessToken } })
          if (res.status === 200) {
            dispatch({ type: 'LOG_IN', userInfo: res.data })
          }
        } catch (error) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('pwd')
          dispatch({ type: 'LOG_OUT' })
          toast.error('Session expired. Please login again', { autoClose: 3000 })
        }
      }
    }
    getSelfInfo()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (uploadResponse !== null) {
      files[uploadResponse.index].success = uploadResponse.success
      setFiles([...files])
    }
    // eslint-disable-next-line
  }, [uploadResponse])

  useEffect(() => {
    files.forEach((file, index) => {
      if (file && !file.isUploaded) {
        const formData = new FormData()
        formData.append('file', file)
        let success = null
        axios
          .post('/image', formData, { headers: { Authorization: 'Bearer ' + localStorage.accessToken, 'Content-Type': false } })
          .then((res) => {
            success = true
            dispatch({ type: 'IMAGES_CHANGE' })
          })
          .catch((error) => {
            console.log('error', error)
            success = false
          })
          .finally(() => {
            dispatch({ type: 'UPLOAD_RESPONSE', uploadResponse: { index, success } })
          })
        file.isUploaded = true
      }
    })
    // eslint-disable-next-line
  }, [files])

  const handleFilesChange = (tmpFiles) => {
    tmpFiles.forEach((tmpFile) => {
      tmpFile.preview = URL.createObjectURL(tmpFile)
    })
    setFiles([...files, ...tmpFiles])
  }

  const download = (imgId, imgUrl) => {
    var link = document.createElement('a')
    link.href = imgUrl
    link.download = imgId
    link.style.display = 'none'
    var evt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })

    document.body.appendChild(link)
    link.dispatchEvent(evt)
    console.log('Download', imgId, imgUrl)
    document.body.removeChild(link)
  }

  const downloadAll = (imgsId) => {
    for (const imgId of imgsId) {
      for (const imagePreview of imagesPreview) {
        if (imgId === imagePreview.id) {
          download(imgId, imagePreview.url)
          break
        }
      }
    }
  }

  return selectedImages.length === 0 ? (
    <>
      <CModal fullscreen visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Upload images to encrypt</CModalTitle>
        </CModalHeader>

        <CModalBody className="bg-light">
          <CContainer>
            <CRow className="m-0">
              <CFormInput
                id="btn-upload"
                className="d-none"
                type="file"
                aria-label="button upload file"
                multiple
                onChange={(e) => handleFilesChange([...e.target.files])}
                label={
                  <div
                    className="upload-respond"
                    onDragOver={(e) => {
                      e.preventDefault()
                      setDrag(true)
                    }}
                    onDragEnter={(e) => {
                      setDrag(true)
                    }}
                    onDragLeave={(e) => {
                      setDrag(false)
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      setDrag(false)
                      handleFilesChange([...e.dataTransfer.files])
                    }}
                  >
                    <CContainer id="dropContainer" className={drag ? 'py-4 bg-body drag' : 'py-4 bg-body'} style={{ borderRadius: '6px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>
                      <CRow className="justify-content-center">
                        <CCol xs={'auto'}>
                          <FontAwesomeIcon icon={faDiceD6} className="text-muted" style={{ fontSize: '4rem' }} />
                        </CCol>
                      </CRow>
                      <CRow className="justify-content-center">
                        <CCol xs={'auto'}>
                          <div className="btn btn-primary rounded-pill px-4 py-3 mt-3">
                            <FontAwesomeIcon icon={faUpload} className="fs-5 me-2" />
                            <h5 className="d-inline">Select Images</h5>
                          </div>
                        </CCol>
                      </CRow>
                      <CRow className="justify-content-center">
                        <CCol xs={'auto'}>
                          <h5 className="mt-3">or drop images here</h5>
                        </CCol>
                      </CRow>
                    </CContainer>
                    <div className="btn btn-primary rounded-pill px-4 py-3">
                      <FontAwesomeIcon icon={faUpload} className="fs-5 me-2" />
                      <h5 className="d-inline">Select Images</h5>
                    </div>
                  </div>
                }
              />
            </CRow>

            <CRow className="m-0 mt-4">
              <CCol>
                <CAlert color="info" className="d-flex align-items-center m-0">
                  <CIcon icon={cilInfo} className="flex-shrink-0 me-2" width={24} height={24} />
                  <div>We only support PNG & JPG File!</div>
                </CAlert>
              </CCol>
            </CRow>

            <CRow className="m-0 mt-4">
              {files.map((file, index) => {
                return file !== null ? (
                  <CCol xs={12} md={6} xl={4} key={index} className="mb-4">
                    <CCard>
                      <CRow className="g-0">
                        <CCol xs={4}>
                          <div className="respond-container">
                            <CCardImage src={file.preview} alt="This is not a PNG or JPG File" className="respond-img" />
                          </div>
                        </CCol>
                        <CCol xs={6}>
                          <CCardBody style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                            <CCardTitle style={{ textOverflow: 'ellipsis' }}>{file.name}</CCardTitle>
                            <small className={file.success === true ? 'px-2 py-1 fw-semibold text-success bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2' : 'd-none'}>Update Success</small>
                            <small className={file.success === false ? 'px-2 py-1 fw-semibold text-danger bg-danger bg-opacity-10 border border-danger border-opacity-10 rounded-2' : 'd-none'}>Update Failure</small>
                          </CCardBody>
                        </CCol>
                        <CCol xs={2} className="d-flex justify-content-center align-items-center">
                          {file.success === undefined ? (
                            <CSpinner />
                          ) : (
                            <CCloseButton
                              onClick={(e) => {
                                e.stopPropagation()
                                files[index] = null
                                URL.revokeObjectURL(file.preview)
                                setFiles([...files])
                              }}
                            />
                          )}
                        </CCol>
                      </CRow>
                    </CCard>
                  </CCol>
                ) : (
                  <></>
                )
              })}
            </CRow>
          </CContainer>
        </CModalBody>
      </CModal>

      <CHeader position="sticky" className="p-0 mb-3">
        <CContainer fluid>
          <CHeaderBrand to="#" className="ff-logo fs-2 p-0">
            Ciaphedra
          </CHeaderBrand>

          <CButtonGroup className="menu-btn-group" role="group" aria-label="Basic checkbox toggle button group">
            <CFormCheck type="radio" name="menu" id="btn-home" defaultChecked={atHomeRoute} label={<FontAwesomeIcon icon={faHouse} className="fs-15" />} onClick={() => navigate('/')} />
            <CFormCheck type="radio" name="menu" id="btn-shared" defaultChecked={!atHomeRoute} label={<FontAwesomeIcon icon={faStore} className="fs-15" />} onClick={() => navigate('/shared-with-me')} />
          </CButtonGroup>

          <CHeaderNav className="ms-3">
            <CAvatar color="light" size="md" className="me-2 cursor-pointer" onClick={() => setVisible(true)}>
              <FontAwesomeIcon icon={faUpload} className="fs-6" />
            </CAvatar>

            <CDropdown variant="nav-item" placement="bottom-end">
              <CDropdownToggle className="p-0" caret={false}>
                <CAvatar color="secondary" size="md">
                  {userInfo.firstName ? userInfo.firstName[0] + userInfo.lastName[0] : 'NN'}
                </CAvatar>
              </CDropdownToggle>
              <CDropdownMenu className="mt-1 box-shadow-lg">
                <Link className="d-flex align-items-center dropdown-item dropdown-user">
                  <CAvatar color="secondary" className="me-2">
                    {userInfo.firstName ? userInfo.firstName[0] + userInfo.lastName[0] : 'NN'}
                  </CAvatar>
                  {userInfo.firstName ? userInfo.firstName + ' ' + userInfo.lastName : 'No Name'}
                </Link>
                <Link className="d-flex align-items-center dropdown-item dropdown-user">
                  <CAvatar color="light" className="me-2">
                    <FontAwesomeIcon icon={faGear} className="fs-6" />
                  </CAvatar>
                  Settings
                </Link>
                <Link
                  className="d-flex align-items-center dropdown-item dropdown-user"
                  onClick={() => {
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('refreshToken')
                    localStorage.removeItem('pwd')
                    dispatch({ type: 'LOG_OUT' })
                  }}
                >
                  <CAvatar color="light" className="me-2">
                    <FontAwesomeIcon icon={faRightFromBracket} className="fs-6" />
                  </CAvatar>
                  Log out
                </Link>
              </CDropdownMenu>
            </CDropdown>
          </CHeaderNav>
        </CContainer>
      </CHeader>
    </>
  ) : (
    <CHeader position="sticky" className="p-0 py-2 mb-3">
      <CContainer fluid>
        <CRow className="flex-1" xs={{ gutter: 2 }} sm={{ gutter: 4 }}>
          <CCol xs={12} sm={6}>
            <CRow xs={{ cols: 'auto' }} className="justify-content-between">
              <CCol>
                <CFormCheck
                  button={{ color: 'primary', variant: 'outline', shape: 'rounded-pill' }}
                  id="btnSelectAll"
                  label={
                    <>
                      <FontAwesomeIcon icon={faCheck} className="fs-6 me-2" />
                      Select All
                    </>
                  }
                  checked={isSelectAll === true ? true : false}
                  onChange={(e) => {
                    dispatch({ type: 'SELECT_ALL', checked: e.target.checked })
                  }}
                />
              </CCol>
              <CCol>
                <CModal visible={shareVisible} onClose={() => setShareVisible(false)}>
                  <CModalHeader onClose={() => setShareVisible(false)}>
                    <CModalTitle>Share images to</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <div className="d-flex">
                      <CFormInput type="text" placeholder="Email" id="emailHeader" />
                      <CButton
                        className="ms-2"
                        color="primary"
                        onClick={() => {
                          const email = document.querySelector('#emailHeader').value
                          selectedImages.forEach((selectedImage) => {
                            axios
                              .post(`/image/share-image/${selectedImage}`, { password: localStorage.pwd, email }, { headers: { Authorization: 'Bearer ' + localStorage.accessToken } })
                              .then((res) => {
                                toast.success(`Share ${selectedImage} to ${email} successfully`, { autoClose: 3000 })
                              })
                              .catch((error) => {
                                toast.error(error.response.data.message, { autoClose: 3000 })
                              })
                          })
                        }}
                      >
                        Share
                      </CButton>
                    </div>
                  </CModalBody>
                </CModal>

                <CButton color="primary" variant="outline" shape="rounded-pill" onClick={() => setShareVisible(true)}>
                  <FontAwesomeIcon icon={faShare} className="fs-6 me-2" />
                  Share
                </CButton>
              </CCol>
            </CRow>
          </CCol>

          <CCol xs={12} sm={6}>
            <CRow xs={{ cols: 'auto' }} className="justify-content-between">
              <CCol>
                <CButton
                  color="primary"
                  variant="outline"
                  shape="rounded-pill"
                  onClick={() => {
                    selectedImages.forEach((selectedImage) => {
                      axios
                        .delete(`/image/${selectedImage}`, { headers: { Authorization: 'Bearer ' + localStorage.accessToken } })
                        .then((res) => {
                          document.getElementById(selectedImage).checked = false
                          toast.success('Delete Successfully', { autoClose: 3000 })
                          dispatch({ type: 'REMOVE_IMAGE_PREVIEW', id: selectedImage })
                          dispatch({ type: 'UNSELECT_IMG', imgId: selectedImage })
                          dispatch({ type: 'IMAGES_CHANGE' })
                          dispatch({ type: 'SELECT_ALL', checked: -1 })
                        })
                        .catch((error) => {
                          toast.error(error.response.data.message, { autoClose: 3000 })
                        })
                    })
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} className="fs-6 me-2" />
                  Delete
                </CButton>
              </CCol>
              <CCol>
                <CButton color="primary" variant="outline" shape="rounded-pill" onClick={() => downloadAll(selectedImages)}>
                  <FontAwesomeIcon icon={faDownload} className="fs-6 me-2" />
                  Download
                </CButton>
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CContainer>
    </CHeader>
  )
}

export default Header
