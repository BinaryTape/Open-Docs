## スキーマの依存関係

別のモジュールに対するスキーマの依存関係を指定できます。

=== "Kotlin"
    ```kotlin
    // project-a/build.gradle.kts

    sqldelight {
      databases {
        create("MyDatabase") {
          packageName.set("com.example.projecta")
          dependency(project(":ProjectB"))
        }
      }
    }
    ```
=== "Groovy"
    ```groovy
    // project-a/build.gradle

    sqldelight {
      databases {
        MyDatabase {
          packageName = "com.example.projecta"
          dependency project(":ProjectB")
        }
      }
    }
    ```

これは `ProjectB` 内の `MyDatabase` を探し、コンパイル時にそのスキーマを含めます。これを機能させるには、`ProjectB` に（この場合は `MyDatabase` という）同じ名前のデータベースが必要ですが、異なるパッケージで生成される必要があります。`ProjectB` の Gradle 設定は以下のようになります。

=== "Kotlin"
    ```kotlin hl_lines="4"
    // project-b/build.gradle.kts

    sqldelight {
      databases {
        // 同じデータベース名
        create("MyDatabase") {
          package = "com.example.projectb"
        }
      }
    }
    ```
=== "Groovy"
    ```groovy hl_lines="4"
    // project-b/build.gradle

    sqldelight {
      databases {
        // 同じデータベース名
        MyDatabase {
          package = "com.example.projectb"
        }
      }
    }
    ```
`deriveSchemaFromMigrations = true` を使用する場合、このモジュールに依存するすべてのモジュールでもこの機能を有効にする必要があります。