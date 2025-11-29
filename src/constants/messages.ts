// Константы для toast уведомлений на русском языке
export const MESSAGES = {
  // Auth
  LOGIN_SUCCESS: 'Вы успешно вошли!',
  REGISTRATION_SUCCESS: 'Регистрация успешна!',
  // НЕ добавляй LOGOUT_SUCCESS - при выходе не должно быть toast
  PASSWORD_CHANGE_SUCCESS: 'Пароль успешно изменен!',
  PASSWORD_CHANGE_ERROR: 'Не удалось изменить пароль',
  PASSWORD_RESET_SUCCESS: 'Письмо для сброса пароля отправлено!',
  PASSWORD_RESET_ERROR: 'Не удалось отправить письмо для сброса пароля',

  // Projects
  PROJECT_CREATE_SUCCESS: 'Проект успешно создан!',
  PROJECT_CREATE_ERROR: 'Не удалось создать проект',
  PROJECT_UPDATE_SUCCESS: 'Проект успешно обновлен!',
  PROJECT_UPDATE_ERROR: 'Не удалось обновить проект',
  PROJECT_DELETE_SUCCESS: 'Проект успешно удален',
  PROJECT_DELETE_ERROR: 'Не удалось удалить проект',
  MEMBER_INVITE_SUCCESS: 'Участник приглашен!',
  MEMBER_INVITE_ERROR: 'Не удалось пригласить участника',

  // Users
  PROFILE_UPDATE_SUCCESS: 'Профиль успешно обновлен!',
  PROFILE_UPDATE_ERROR: 'Не удалось обновить профиль',
  AVATAR_UPLOAD_SUCCESS: 'Аватар успешно загружен!',
  AVATAR_UPLOAD_ERROR: 'Не удалось загрузить аватар',

  // Vacancies
  VACANCY_CREATE_SUCCESS: 'Вакансия успешно создана!',
  VACANCY_CREATE_ERROR: 'Не удалось создать вакансию',
  VACANCY_DELETE_SUCCESS: 'Вакансия успешно удалена',
  VACANCY_DELETE_ERROR: 'Не удалось удалить вакансию',
  APPLICATION_SUBMIT_SUCCESS: 'Отклик успешно отправлен!',
  APPLICATION_SUBMIT_ERROR: 'Не удалось откликнуться на вакансию',

  // Technologies
  TECHNOLOGY_CREATE_SUCCESS: 'Технология успешно создана!',
  TECHNOLOGY_CREATE_ERROR: 'Не удалось создать технологию',
  TECHNOLOGY_UPDATE_SUCCESS: 'Технология успешно обновлена!',
  TECHNOLOGY_UPDATE_ERROR: 'Не удалось обновить технологию',
  TECHNOLOGY_DELETE_SUCCESS: 'Технология успешно удалена',
  TECHNOLOGY_DELETE_ERROR: 'Не удалось удалить технологию',

  // Questions
  QUESTION_CREATE_SUCCESS: 'Вопрос успешно создан!',
  QUESTION_CREATE_ERROR: 'Не удалось создать вопрос',
  QUESTION_UPDATE_SUCCESS: 'Вопрос успешно обновлен!',
  QUESTION_UPDATE_ERROR: 'Не удалось обновить вопрос',
  QUESTION_DELETE_SUCCESS: 'Вопрос успешно удален',
  QUESTION_DELETE_ERROR: 'Не удалось удалить вопрос',

  // Tags
  TAG_CREATE_SUCCESS: 'Тег успешно создан!',
  TAG_CREATE_ERROR: 'Не удалось создать тег',
  TAG_UPDATE_SUCCESS: 'Тег успешно обновлен!',
  TAG_UPDATE_ERROR: 'Не удалось обновить тег',
  TAG_DELETE_SUCCESS: 'Тег успешно удален',
  TAG_DELETE_ERROR: 'Не удалось удалить тег',

  // Generic
  ERROR_OCCURRED: 'Произошла ошибка',
} as const;
