import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import Forms from 'modules/Form/Forms';
import CollectionsIcon from '@mui/icons-material/Collections';
import SouthSharpIcon from '@mui/icons-material/SouthSharp';
import NorthSharpIcon from '@mui/icons-material/NorthSharp';

const EditQuestion = (props, formRef) => {
  const { selectedData } = props;
  const { save } = props;
  const { t } = useTranslation();
  const [type, setType] = React.useState(selectedData?.type_id);
  const [answers, setAnswers] = React.useState([{ order_number: 1 }]);
  const [file, setFile] = React.useState();
  const [isMulti, setIsMulti] = React.useState(false);
  const [deleteIds, setDeleteIds] = React.useState([]);
  const questionnaireFields = [
    {
      key: 'question',
      value: selectedData?.question,
      label: `${t('survey.questionnaire')}`,
      type: 'textArea',
      required: true,
      labelBold: true,
    },
    {
      key: 'description',
      value: selectedData?.description,
      label: `${t('survey.questionnaireDesc')}`,
      type: 'textArea',
      required: false,
      labelBold: true,
    },
    {
      key: 'image',
      label: '',
      value: '',
      type: 'fileUpload',
      required: false,
      fileName: '',
      multiple: false,
      isExtendedButton: true,
      isExtendedButtonText: (
        <>
          <CollectionsIcon /> {t('survey.selectImage')}
        </>
      ),
      isExtendedButtonClass: 'btn btn-outline-warning mr-5',
      altImage: selectedData?.file_path || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',
      altImageClass: selectedData?.file_path ? '' : 'd-none',
      accept: 'image/*',
      fileType: 'image',
      clearButton: true,
      isClearButtonText: (
        <>
          <CollectionsIcon style={{ opacity: 0, width: 0 }} /> {t('foodManagement.deletePhoto')}
        </>
      ),
      isClearButtonClass: 'btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only m-btn--circle-28',
      onChange: (files) => {
        const [image] = !files ? [] : files;
        if (image) {
          const reader = new FileReader();
          reader.addEventListener(
            'load',
            () => {
              setFile(reader.result);
            },
            false
          );
          reader.readAsDataURL(image);
        }
      },
    },
    {
      key: 'is_required',
      value: selectedData?.is_required,
      label: `${t('survey.answerRequired')}`,
      type: 'checkbox',
      required: false,
      labelBold: true,
    },
    {
      key: 'type_id',
      value: selectedData?.type_id,
      label: `${t('survey.questionnaireType')}`,
      type: 'dropdown',
      required: true,
      labelBold: true,
      options: props?.question_types?.map((qt) => ({
        text: qt.name,
        value: qt.id,
      })),
      onChange: setType,
    },
  ];

  const { question_types: tmpQt } = props;
  const tmpType = tmpQt?.find((qt) => qt.id === type);

  React.useEffect(() => {
    save({ answers: tmpType?.code === 'SELECT' ? [...answers] : [], image: file, is_multi_answer: isMulti, delete_ids: deleteIds || [] });
  }, [isMulti, tmpType, answers, file]);

  React.useEffect(() => {
    if (selectedData) {
      setAnswers(selectedData?.answers?.map((sd) => ({ ...sd, image: sd.file_path })));
    }
  }, [selectedData]);

  return (
    <>
      <div className="custom-forms">
        <Forms key={selectedData ? 'q-edit-form' : props?.question_types?.length > 0 ? 'q-form-data' : 'no-data'} ref={formRef} fields={questionnaireFields} />
      </div>
      <br />
      <br />
      {tmpType?.code === 'SELECT' && (
        <div className="custom-container">
          {answers
            ?.sort((a, b) => {
              if (a?.order_number < b?.order_number) {
                return -1;
              }
              if (a?.order_number > b?.order_number) {
                return 1;
              }
              return 0;
            })
            ?.map((a, i) => (
              <div key={`a-${i}`} className="d-flex mb-1 space-x-4">
                <div style={{ width: 100 }} className="d-flex justify-content-center">
                  {i !== 0 && (
                    <Button
                      variant="outline-separator"
                      type="button"
                      size="sm"
                      onClick={() => {
                        const tmp = [...answers];
                        const orderNumber = tmp[i - 1].order_number;
                        tmp[i - 1].order_number = tmp[i].order_number;
                        tmp[i].order_number = orderNumber;
                        setAnswers(tmp);
                      }}
                    >
                      {/* <i className="flaticon2-arrow-up text-black" /> */}
                      <NorthSharpIcon className="text-black" fontSize="small" />
                    </Button>
                  )}
                  {i !== answers.length - 1 && (
                    <Button
                      variant="outline-separator"
                      type="button"
                      size="sm"
                      onClick={() => {
                        const tmp = [...answers];
                        const orderNumber = tmp[i + 1].order_number;
                        tmp[i + 1].order_number = tmp[i].order_number;
                        tmp[i].order_number = orderNumber;
                        setAnswers(tmp);
                      }}
                    >
                      {/* <i className="flaticon2-arrow-down text-black" /> */}
                      <SouthSharpIcon className="text-black" fontSize="small" />
                    </Button>
                  )}
                </div>
                <input
                  className="form-control w-30"
                  placeholder="Асуумж"
                  value={a.answer || ''}
                  onChange={(e) => {
                    const tmp = [...answers];
                    tmp[i].answer = e.target.value;
                    tmp[i].code = e.target.value;
                    tmp[i].order_number = i + 1;
                    setAnswers(tmp);
                  }}
                />
                <label className="btn btn-outline-warning btn-sm">
                  <input
                    className="form-control"
                    style={{ display: 'none' }}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const [answerFile] = e.target.files;
                      if (answerFile) {
                        const reader = new FileReader();
                        reader.addEventListener(
                          'load',
                          () => {
                            const tmp = [...answers];
                            tmp[i].image = reader.result;
                            setAnswers(tmp);
                          },
                          false
                        );
                        reader.readAsDataURL(answerFile);
                      } else {
                        const tmp = [...answers];
                        tmp[i].image = null;
                        setAnswers(tmp);
                      }
                    }}
                  />
                  {a.image ? <img src={a.image} alt={a.answer} height={24} width={24} /> : <CollectionsIcon />}
                </label>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    const tmp = [...answers];
                    if (tmp[i].id) {
                      setDeleteIds([...deleteIds, tmp[i].id]);
                    }
                    tmp.splice(i, 1);
                    setAnswers(tmp);
                  }}
                  className="px-3"
                >
                  <i className="flaticon2-cross" />
                </Button>
              </div>
            ))}
          <div style={{ paddingLeft: 112 }}>
            <label className="my-3">
              <input
                type="checkbox"
                checked={isMulti}
                onChange={(e) => {
                  setIsMulti(e.target.checked);
                }}
              />{' '}
              Олон утга сонгоно
            </label>
            <div>
              <Button
                onClick={() => {
                  setAnswers([...answers, { order_number: answers.length }]);
                }}
                variant="outline-alternate"
                outline
                className="text-uppercase br-8 py-2 custom-blue-btn"
              >
                {t('common.add')}
              </Button>
            </div>
          </div>
        </div>
      )}
      <div style={{ height: '130px' }}></div>
    </>
  );
};

export default React.forwardRef(EditQuestion);
