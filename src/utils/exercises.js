// src/data/exercises.js
export const exerciseCategories = [
  {
    id: 'fullbody',
    name: 'Фулл бади',
    icon: '🏋️',
    description: 'Тренировка всех групп мышц за одну сессию',
    exercises: [
      { id: 'squat', name: 'Приседания со штангой', category: 'fullbody', muscleGroup: 'Ноги, Ягодицы' },
      { id: 'benchpress', name: 'Жим штанги лежа', category: 'fullbody', muscleGroup: 'Грудь, Трицепс' },
      { id: 'deadlift', name: 'Становая тяга', category: 'fullbody', muscleGroup: 'Спина, Ноги' },
      { id: 'pullup', name: 'Подтягивания', category: 'fullbody', muscleGroup: 'Спина, Бицепс' },
      { id: 'overheadpress', name: 'Жим штанги стоя', category: 'fullbody', muscleGroup: 'Плечи' },
      { id: 'row', name: 'Тяга штанги в наклоне', category: 'fullbody', muscleGroup: 'Спина' },
      { id: 'pushup', name: 'Отжимания', category: 'fullbody', muscleGroup: 'Грудь, Трицепс' },
      { id: 'plank', name: 'Планка', category: 'fullbody', muscleGroup: 'Пресс' },
    ]
  },
  {
    id: 'split',
    name: 'Сплит',
    icon: '💪',
    description: 'Раздельные тренировки по группам мышц',
    subCategories: [
      {
        id: 'back_biceps',
        name: 'Спина + Бицепс',
        icon: '🏋️‍♂️',
        exercises: [
          { id: 'pullup', name: 'Подтягивания', category: 'back_biceps', muscleGroup: 'Широчайшие' },
          { id: 'bentover_row', name: 'Тяга штанги в наклоне', category: 'back_biceps', muscleGroup: 'Спина' },
          { id: 'lat_pulldown', name: 'Тяга верхнего блока', category: 'back_biceps', muscleGroup: 'Широчайшие' },
          { id: 'seated_row', name: 'Горизонтальная тяга', category: 'back_biceps', muscleGroup: 'Середина спины' },
          { id: 'face_pull', name: 'Тяга к лицу', category: 'back_biceps', muscleGroup: 'Задние дельты' },
          { id: 'barbell_curl', name: 'Подъем штанги на бицепс', category: 'back_biceps', muscleGroup: 'Бицепс' },
          { id: 'hammer_curl', name: 'Молотки', category: 'back_biceps', muscleGroup: 'Бицепс, Предплечья' },
          { id: 'preacher_curl', name: 'Подъем на бицепс на скамье Скотта', category: 'back_biceps', muscleGroup: 'Бицепс' },
        ]
      },
      {
        id: 'chest_triceps',
        name: 'Грудь + Трицепс',
        icon: '🏋️‍♀️',
        exercises: [
          { id: 'benchpress', name: 'Жим штанги лежа', category: 'chest_triceps', muscleGroup: 'Грудь' },
          { id: 'incline_press', name: 'Жим на наклонной скамье', category: 'chest_triceps', muscleGroup: 'Верх груди' },
          { id: 'dumbbell_fly', name: 'Разводка гантелей лежа', category: 'chest_triceps', muscleGroup: 'Грудь' },
          { id: 'cable_crossover', name: 'Сведения в кроссовере', category: 'chest_triceps', muscleGroup: 'Грудь' },
          { id: 'dips', name: 'Отжимания на брусьях', category: 'chest_triceps', muscleGroup: 'Грудь, Трицепс' },
          { id: 'tricep_pushdown', name: 'Разгибания на трицепс', category: 'chest_triceps', muscleGroup: 'Трицепс' },
          { id: 'skullcrusher', name: 'Французский жим', category: 'chest_triceps', muscleGroup: 'Трицепс' },
          { id: 'overhead_tricep', name: 'Разгибания из-за головы', category: 'chest_triceps', muscleGroup: 'Трицепс' },
        ]
      },
      {
        id: 'legs_shoulders',
        name: 'Ноги + Плечи',
        icon: '🦵',
        exercises: [
          { id: 'squat', name: 'Приседания со штангой', category: 'legs_shoulders', muscleGroup: 'Квадрицепс' },
          { id: 'leg_press', name: 'Жим ногами', category: 'legs_shoulders', muscleGroup: 'Ноги' },
          { id: 'leg_extension', name: 'Разгибания ног', category: 'legs_shoulders', muscleGroup: 'Квадрицепс' },
          { id: 'leg_curl', name: 'Сгибания ног', category: 'legs_shoulders', muscleGroup: 'Бицепс бедра' },
          { id: 'calf_raise', name: 'Подъемы на носки', category: 'legs_shoulders', muscleGroup: 'Икры' },
          { id: 'shoulder_press', name: 'Жим штанги сидя', category: 'legs_shoulders', muscleGroup: 'Плечи' },
          { id: 'lateral_raise', name: 'Махи в стороны', category: 'legs_shoulders', muscleGroup: 'Средние дельты' },
          { id: 'front_raise', name: 'Подъемы перед собой', category: 'legs_shoulders', muscleGroup: 'Передние дельты' },
          { id: 'rear_delt_fly', name: 'Махи в наклоне', category: 'legs_shoulders', muscleGroup: 'Задние дельты' },
        ]
      }
    ]
  },
  {
    id: 'cardio',
    name: 'Кардио',
    icon: '🏃',
    description: 'Аэробные тренировки для выносливости',
    exercises: [
      { id: 'running', name: 'Бег', category: 'cardio', muscleGroup: 'Ноги, Сердечно-сосудистая система' },
      { id: 'cycling', name: 'Велосипед', category: 'cardio', muscleGroup: 'Ноги' },
      { id: 'rowing', name: 'Гребля', category: 'cardio', muscleGroup: 'Спина, Ноги' },
      { id: 'jumprope', name: 'Скакалка', category: 'cardio', muscleGroup: 'Ноги, Плечи' },
      { id: 'elliptical', name: 'Эллипс', category: 'cardio', muscleGroup: 'Ноги' },
      { id: 'stairmaster', name: 'Степпер', category: 'cardio', muscleGroup: 'Ноги' },
      { id: 'swimming', name: 'Плавание', category: 'cardio', muscleGroup: 'Все тело' },
      { id: 'hiit', name: 'ВИИТ', category: 'cardio', muscleGroup: 'Все тело' },
    ]
  },
  {
    id: 'stretching',
    name: 'Растяжка',
    icon: '🧘',
    description: 'Упражнения для гибкости и мобильности',
    exercises: [
      { id: 'hamstring_stretch', name: 'Растяжка задней поверхности бедра', category: 'stretching', muscleGroup: 'Бицепс бедра' },
      { id: 'quad_stretch', name: 'Растяжка квадрицепса', category: 'stretching', muscleGroup: 'Квадрицепс' },
      { id: 'hip_flexor_stretch', name: 'Растяжка сгибателей бедра', category: 'stretching', muscleGroup: 'Передняя поверхность бедра' },
      { id: 'chest_stretch', name: 'Растяжка грудных мышц', category: 'stretching', muscleGroup: 'Грудь' },
      { id: 'back_stretch', name: 'Растяжка спины', category: 'stretching', muscleGroup: 'Спина' },
      { id: 'shoulder_stretch', name: 'Растяжка плеч', category: 'stretching', muscleGroup: 'Плечи' },
      { id: 'tricep_stretch', name: 'Растяжка трицепса', category: 'stretching', muscleGroup: 'Трицепс' },
      { id: 'calf_stretch', name: 'Растяжка икр', category: 'stretching', muscleGroup: 'Икры' },
      { id: 'spine_twist', name: 'Скручивания позвоночника', category: 'stretching', muscleGroup: 'Спина, Пресс' },
      { id: 'neck_stretch', name: 'Растяжка шеи', category: 'stretching', muscleGroup: 'Шея' },
    ]
  }
];

// Вспомогательные функции
export const getExerciseById = (id) => {
  for (const category of exerciseCategories) {
    if (category.exercises) {
      const exercise = category.exercises.find(ex => ex.id === id);
      if (exercise) return exercise;
    }
    if (category.subCategories) {
      for (const subCategory of category.subCategories) {
        const exercise = subCategory.exercises.find(ex => ex.id === id);
        if (exercise) return exercise;
      }
    }
  }
  return null;
};

export const getExercisesByCategory = (categoryId) => {
  const category = exerciseCategories.find(cat => cat.id === categoryId);
  if (!category) return [];
  
  if (category.exercises) return category.exercises;
  if (category.subCategories) {
    return category.subCategories.flatMap(sub => sub.exercises);
  }
  return [];
};