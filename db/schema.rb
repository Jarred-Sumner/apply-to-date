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

ActiveRecord::Schema.define(version: 20180206224820) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "uuid-ossp"
  enable_extension "pgcrypto"

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
    t.index ["provider"], name: "index_external_authentications_on_provider"
    t.index ["uid"], name: "index_external_authentications_on_uid"
    t.index ["user_id"], name: "index_external_authentications_on_user_id"
  end

  create_table "profiles", id: :string, force: :cascade do |t|
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
    t.index ["featured"], name: "index_profiles_on_featured"
    t.index ["user_id"], name: "index_profiles_on_user_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "email", null: false
    t.string "username", null: false
    t.string "crypted_password"
    t.string "salt"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "remember_me_token"
    t.datetime "remember_me_token_expires_at"
    t.string "reset_password_token"
    t.datetime "reset_password_token_expires_at"
    t.datetime "reset_password_email_sent_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["remember_me_token"], name: "index_users_on_remember_me_token"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token"
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "external_authentications", "users"
  add_foreign_key "profiles", "users"
end
