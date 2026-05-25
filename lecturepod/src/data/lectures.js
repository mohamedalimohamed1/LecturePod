export const semesterLectures = {
  7: [
    { id: 'lecture-1', title: 'Sistem Analizi - Vize Ve Final', file: 'lecture_one.json' },
    { id: 'lecture-2', title: 'Dijital Okuryazarlık - Vize Ve Final', file: 'lecture_six.json' },
    { id: 'lecture-3', title: 'Görüntü İşleme - Vize Ve Final', file: 'lecture_four.json' },
    { id: 'lecture-4', title: 'Kriptoloji ve Bilgi Güvenliği - Vize Sınavı', file: 'lecture_seven.json' },
    { id: 'lecture-5', title: 'Uzaktan Algılama - Vize Sınavı', file: 'lecture_three.json' },
    { id: 'lecture-6', title: 'İşletim Sistemleri - Vize Sınavı', file: 'lecture_five.json' },
    { id: 'lecture-7', title: 'Örüntü Tanıma - Vize Ve Final', file: 'lecture_two.json' },
  ],
  8: [
    // Add your new lecture here:
    { id: 'lecture-8', title: 'Dijital Okuryazarlık - Vize Soruları', file: 'lecture_eight.json' },
    { id: 'lecture-9', title: 'Ağ ve Yazılım Güvenliği - Vize Soruları', file: 'lecture_nine.json' },
  ]
};

export const semesters = Array.from({ length: 8 }, (_, index) => {
  const semester = index + 1;
  return {
    id: semester,
    number: semester,
    active: semester === 7 || semester === 8,
  };
});
