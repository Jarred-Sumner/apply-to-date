# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180331003216) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "uuid-ossp"
  enable_extension "pgcrypto"
  enable_extension "citext"

  create_table "applications", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "applicant_id"
    t.citext "profile_id", null: false
    t.uuid "user_id", null: false
    t.integer "status", default: 0, null: false
    t.jsonb "social_links", default: {}, null: false
    t.jsonb "sections", null: false
    t.string "name", default: "", null: false
    t.citext "email", null: false
    t.string "photos", default: [], null: false, array: true
    t.string "location"
    t.decimal "latitude"
    t.decimal "longitude"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "sex"
    t.string "recommended_contact_method"
    t.string "phone"
    t.citext "applicant_profile_id"
    t.bigint "date_event_application_id"
    t.integer "category"
    t.index ["applicant_id"], name: "index_applications_on_applicant_id"
    t.index ["applicant_profile_id"], name: "index_applications_on_applicant_profile_id"
    t.index ["date_event_application_id"], name: "index_applications_on_date_event_application_id"
    t.index ["email"], name: "index_applications_on_email"
    t.index ["profile_id"], name: "index_applications_on_profile_id"
    t.index ["status"], name: "index_applications_on_status"
    t.index ["user_id"], name: "index_applications_on_user_id"
  end

  create_table "block_users", force: :cascade do |t|
    t.uuid "blocked_user_id", null: false
    t.uuid "blocked_by_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["blocked_by_id"], name: "index_block_users_on_blocked_by_id"
    t.index ["blocked_user_id"], name: "index_block_users_on_blocked_user_id"
  end

  create_table "date_event_applications", force: :cascade do |t|
    t.citext "profile_id"
    t.bigint "date_event_id"
    t.integer "confirmation_status", default: 0, null: false
    t.integer "approval_status", default: 0, null: false
    t.jsonb "social_links", default: {}, null: false
    t.jsonb "sections", default: {}, null: false
    t.string "name", default: "", null: false
    t.string "email", null: false
    t.string "photos", default: [], null: false, array: true
    t.string "phone"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "sex"
    t.string "recommended_contact_method"
    t.uuid "converted_application_id"
    t.index ["approval_status"], name: "index_date_event_applications_on_approval_status"
    t.index ["confirmation_status"], name: "index_date_event_applications_on_confirmation_status"
    t.index ["converted_application_id"], name: "index_date_event_applications_on_converted_application_id"
    t.index ["date_event_id"], name: "index_date_event_applications_on_date_event_id"
    t.index ["email"], name: "index_date_event_applications_on_email"
    t.index ["profile_id"], name: "index_date_event_applications_on_profile_id"
  end

  create_table "date_events", force: :cascade do |t|
    t.citext "profile_id"
    t.uuid "user_id"
    t.integer "status", default: 0, null: false
    t.string "summary"
    t.date "occurs_on_day"
    t.string "occurs_on_day_timezone"
    t.time "starts_at"
    t.string "starts_at_timezone"
    t.time "ends_at"
    t.string "ends_at_timezone"
    t.string "location"
    t.decimal "latitude"
    t.decimal "longitude"
    t.integer "region", default: 0, null: false
    t.integer "category", default: 0, null: false
    t.string "title"
    t.jsonb "sections", default: {}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.citext "slug"
    t.index ["profile_id"], name: "index_date_events_on_profile_id"
    t.index ["slug"], name: "index_date_events_on_slug"
    t.index ["user_id"], name: "index_date_events_on_user_id"
  end

  create_table "devices", force: :cascade do |t|
    t.string "onesignal_uid"
    t.string "uid", null: false
    t.boolean "push_enabled", default: false, null: false
    t.string "platform"
    t.string "app_version"
    t.string "timezone"
    t.datetime "last_seen_at", null: false
    t.string "platform_version"
    t.uuid "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "push_token"
    t.datetime "push_sent_at"
    t.index ["onesignal_uid"], name: "index_devices_on_onesignal_uid", unique: true
    t.index ["uid"], name: "index_devices_on_uid", unique: true
    t.index ["user_id"], name: "index_devices_on_user_id"
  end

  create_table "external_authentications", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "uid"
    t.string "provider", null: false
    t.uuid "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "username"
    t.string "email"
    t.string "name"
    t.jsonb "info"
    t.jsonb "raw_info"
    t.string "access_token", null: false
    t.string "refresh_token"
    t.datetime "access_token_expiration"
    t.string "location"
    t.uuid "application_id"
    t.string "applicant_email"
    t.string "photos", default: [], array: true
    t.string "access_token_secret"
    t.string "sex"
    t.date "birthday"
    t.index ["application_id"], name: "index_external_authentications_on_application_id"
    t.index ["provider"], name: "index_external_authentications_on_provider"
    t.index ["uid"], name: "index_external_authentications_on_uid"
    t.index ["user_id"], name: "index_external_authentications_on_user_id"
  end

  create_table "friendly_id_slugs", force: :cascade do |t|
    t.string "slug", null: false
    t.integer "sluggable_id", null: false
    t.string "sluggable_type", limit: 50
    t.string "scope"
    t.datetime "created_at"
    t.index ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true
    t.index ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type"
    t.index ["sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_id"
    t.index ["sluggable_type"], name: "index_friendly_id_slugs_on_sluggable_type"
  end

  create_table "matchmake_ratings", force: :cascade do |t|
    t.uuid "user_id"
    t.bigint "matchmake_id"
    t.integer "score", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["matchmake_id"], name: "index_matchmake_ratings_on_matchmake_id"
    t.index ["user_id"], name: "index_matchmake_ratings_on_user_id"
  end

  create_table "matchmakes", force: :cascade do |t|
    t.citext "left_profile_id"
    t.citext "right_profile_id"
    t.integer "matchmake_users_count", default: 0, null: false
    t.decimal "rating", default: "0.0", null: false
    t.integer "status", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "matchmake_ratings_count", default: 0, null: false
    t.datetime "notified_left_profile_at"
    t.datetime "notified_right_profile_at"
    t.index ["left_profile_id"], name: "index_matchmakes_on_left_profile_id"
    t.index ["matchmake_ratings_count"], name: "index_matchmakes_on_matchmake_ratings_count"
    t.index ["rating"], name: "index_matchmakes_on_rating"
    t.index ["right_profile_id"], name: "index_matchmakes_on_right_profile_id"
    t.index ["status"], name: "index_matchmakes_on_status"
  end

  create_table "notifications", force: :cascade do |t|
    t.string "chrome_notification_uid"
    t.integer "kind", default: 0, null: false
    t.integer "status", default: 0, null: false
    t.datetime "chrome_notification_sent_at"
    t.datetime "email_sent_at"
    t.datetime "expires_at"
    t.datetime "read_at"
    t.uuid "user_id"
    t.string "notifiable_type"
    t.string "notifiable_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "meta"
    t.datetime "occurred_at"
    t.datetime "push_sent_at"
    t.index ["kind"], name: "index_notifications_on_kind"
    t.index ["notifiable_type", "notifiable_id"], name: "index_notifications_on_notifiable_type_and_notifiable_id"
    t.index ["user_id", "status"], name: "index_notifications_on_user_id_and_status"
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "profile_views", force: :cascade do |t|
    t.citext "profile_id"
    t.uuid "user_id"
    t.datetime "last_viewed_at", null: false
    t.integer "view_count", default: 0, null: false
    t.citext "viewed_by_profile_id"
    t.uuid "viewed_by_user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["last_viewed_at"], name: "index_profile_views_on_last_viewed_at"
    t.index ["profile_id"], name: "index_profile_views_on_profile_id"
    t.index ["user_id"], name: "index_profile_views_on_user_id"
    t.index ["viewed_by_profile_id"], name: "index_profile_views_on_viewed_by_profile_id"
    t.index ["viewed_by_user_id"], name: "index_profile_views_on_viewed_by_user_id"
  end

  create_table "profiles", id: :citext, force: :cascade do |t|
    t.uuid "user_id"
    t.jsonb "sections", null: false
    t.boolean "visible", default: true, null: false
    t.jsonb "social_links"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.text "tagline"
    t.string "photos", array: true
    t.boolean "featured", default: false, null: false
    t.string "recommended_contact_methods", default: [], null: false, array: true
    t.string "location"
    t.decimal "latitude"
    t.decimal "longitude"
    t.string "tags", default: [], null: false, array: true
    t.string "recommended_contact_method"
    t.string "phone"
    t.integer "applications_count", default: 0, null: false
    t.boolean "interested_in_men"
    t.boolean "interested_in_women"
    t.boolean "interested_in_other"
    t.string "sex"
    t.boolean "appear_in_discover", default: true, null: false
    t.boolean "appear_in_matchmake", default: true, null: false
    t.date "birthday"
    t.integer "region"
    t.index ["appear_in_discover"], name: "index_profiles_on_appear_in_discover"
    t.index ["appear_in_matchmake"], name: "index_profiles_on_appear_in_matchmake"
    t.index ["featured"], name: "index_profiles_on_featured"
    t.index ["interested_in_men"], name: "index_profiles_on_interested_in_men"
    t.index ["interested_in_other"], name: "index_profiles_on_interested_in_other"
    t.index ["interested_in_women"], name: "index_profiles_on_interested_in_women"
    t.index ["latitude", "longitude"], name: "index_profiles_on_latitude_and_longitude"
    t.index ["sex"], name: "index_profiles_on_sex"
    t.index ["user_id"], name: "index_profiles_on_user_id"
  end

  create_table "reports", force: :cascade do |t|
    t.uuid "user_id"
    t.string "reportable_type"
    t.string "reportable_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["reportable_type", "reportable_id"], name: "index_reports_on_reportable_type_and_reportable_id"
    t.index ["user_id"], name: "index_reports_on_user_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.citext "email", null: false
    t.citext "username", null: false
    t.string "crypted_password"
    t.string "salt"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "remember_me_token"
    t.datetime "remember_me_token_expires_at"
    t.string "reset_password_token"
    t.datetime "reset_password_token_expires_at"
    t.datetime "reset_password_email_sent_at"
    t.string "sex"
    t.boolean "interested_in_men"
    t.boolean "interested_in_women"
    t.boolean "interested_in_other"
    t.datetime "shuffle_disabled_until"
    t.datetime "last_shuffled_at"
    t.integer "shuffled_session_count", default: 0, null: false
    t.integer "shuffle_status", default: 0, null: false
    t.integer "unread_notifications_count", default: 0, null: false
    t.integer "notifications_count", default: 0, null: false
    t.string "login_token"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["login_token"], name: "index_users_on_login_token", unique: true
    t.index ["remember_me_token"], name: "index_users_on_remember_me_token"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token"
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  create_table "verified_networks", force: :cascade do |t|
    t.uuid "external_authentication_id"
    t.citext "profile_id"
    t.uuid "application_id"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "date_event_application_id"
    t.index ["application_id"], name: "index_verified_networks_on_application_id"
    t.index ["date_event_application_id"], name: "index_verified_networks_on_date_event_application_id"
    t.index ["external_authentication_id"], name: "index_verified_networks_on_external_authentication_id"
    t.index ["profile_id"], name: "index_verified_networks_on_profile_id"
  end

  add_foreign_key "applications", "date_event_applications"
  add_foreign_key "applications", "profiles"
  add_foreign_key "applications", "profiles", column: "applicant_profile_id"
  add_foreign_key "applications", "users"
  add_foreign_key "applications", "users", column: "applicant_id"
  add_foreign_key "block_users", "users", column: "blocked_by_id"
  add_foreign_key "block_users", "users", column: "blocked_user_id"
  add_foreign_key "date_event_applications", "applications", column: "converted_application_id"
  add_foreign_key "date_event_applications", "date_events"
  add_foreign_key "date_event_applications", "profiles"
  add_foreign_key "date_events", "profiles"
  add_foreign_key "date_events", "users"
  add_foreign_key "devices", "users"
  add_foreign_key "external_authentications", "applications"
  add_foreign_key "external_authentications", "users"
  add_foreign_key "matchmake_ratings", "matchmakes"
  add_foreign_key "matchmake_ratings", "users"
  add_foreign_key "matchmakes", "profiles", column: "left_profile_id"
  add_foreign_key "matchmakes", "profiles", column: "right_profile_id"
  add_foreign_key "notifications", "users"
  add_foreign_key "profile_views", "profiles"
  add_foreign_key "profile_views", "profiles", column: "viewed_by_profile_id"
  add_foreign_key "profile_views", "users"
  add_foreign_key "profile_views", "users", column: "viewed_by_user_id"
  add_foreign_key "profiles", "users"
  add_foreign_key "reports", "users"
  add_foreign_key "verified_networks", "applications"
  add_foreign_key "verified_networks", "date_event_applications"
  add_foreign_key "verified_networks", "external_authentications"
  add_foreign_key "verified_networks", "profiles"
end
