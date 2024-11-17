// import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
// import FormCardInputTwoPart from '../../../../components/HOC/style/form/FormCardInputTwoPart'
// import Input from '../../../../components/atomic/Input'
// import { THandleInputChange } from '../../../../types/components/common'
// import { IFormErrors } from '../../../../types/pages/common'
// import { IDoorRuleFormData } from '../../../../types/pages/doorRule'
// import { doorRuleIcon } from '../../../../utils/icons'
// import t from '../../../../utils/translator'
// interface IProps {
//   formData: IDoorRuleFormData
//   formErrors?: IFormErrors
//   handleInputChange?: THandleInputChange
//   disabled?: boolean
//   isLoading?: boolean
// }

// function DoorRuleOptionsFrom({
//   formData,
//   formErrors,
//   handleInputChange,
//   disabled,
//   isLoading,
// }: IProps) {
//   return (
//     <FormCardWithHeader icon={doorRuleIcon} header={t`Rule Option`} twoPart={false}>
//       <FormCardInputTwoPart>
//         {formData.RuleType?.value === '1' && (
//           <Input
//             name="GraceTime"
//             label={t`Grace Time (min) `}
//             type="number"
//             value={formData.GraceTime}
//             onChange={handleInputChange}
//             disabled={disabled || typeof handleInputChange === 'undefined'}
//             error={formErrors?.GraceTime}
//             isLoading={isLoading}
//             required={true}
//           />
//         )}
//         {formData.RuleType?.value === '3' && (
//           <Input
//             name="CardTime"
//             label={t`Card Time (sec)`}
//             type="number"
//             value={formData.CardTime}
//             onChange={handleInputChange}
//             disabled={disabled || typeof handleInputChange === 'undefined'}
//             error={formErrors?.CardTime}
//             isLoading={isLoading}
//             required={true}
//           />
//         )}
//       </FormCardInputTwoPart>
//     </FormCardWithHeader>
//   )
// }

// export default DoorRuleOptionsFrom
