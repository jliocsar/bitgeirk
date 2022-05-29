use std::fs::File;
use std::io::prelude::*;

use wasm_bindgen::prelude::*;
// use ts_rs::TS;

// #[derive(TS)]
// #[ts(export)]
// pub struct User {
//   first_name: String,
// }

#[wasm_bindgen]
pub fn test_file_write(data: String, file_path: String) -> String {
    let write_file_path = format!("{file_path}.bin", file_path = file_path);
    let file = File::create(write_file_path);
    let write_result = match file {
        Ok(mut file) => match file.write_all(&data.as_bytes()) {
            Ok(_) => "Ok".to_string(),
            Err(error) => error.to_string(),
        },
        Err(error) => error.to_string(),
    };

    return write_result.to_string();
}

#[wasm_bindgen]
pub fn get_user_greeting(user_name: String) -> String {
    let response = String::from("hello ");
    return response + &user_name;
}
