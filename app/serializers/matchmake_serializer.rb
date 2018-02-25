class MatchmakeSerializer
  include FastJsonapi::ObjectSerializer
  set_type :matchmake
  belongs_to :left_profile, serializer: 'Profile', class_name: Profile
  belongs_to :right_profile, serializer: 'Profile', class_name: Profile
end