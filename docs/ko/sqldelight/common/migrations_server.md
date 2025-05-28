## 유효한 SQL 마이그레이션

마이그레이션 파일에서 커스텀 Kotlin 타입을 사용하면 해당 파일들은 더 이상 유효한 SQL이 아닙니다. 다른 서비스가 읽을 수 있도록 마이그레이션 파일을 유효한 SQL로 출력하도록 Gradle 태스크를 선택적으로 구성할 수 있습니다.

```groovy
sqldelight {
  databases {
    Database {
      migrationOutputDirectory = layout.buildDirectory.dir("resources/main/migrations")
      migrationOutputFileFormat = ".sql" // Defaults to .sql
  }
}
```

이렇게 하면 `generateMainDatabaseMigrations`라는 새로운 태스크가 생성되며, 이 태스크는 `.sqm` 파일을 지정된 출력 디렉터리에 설정된 출력 형식으로 유효한 SQL로 출력합니다. Flyway와 같은 서비스가 클래스패스에서 해당 파일을 사용할 수 있도록 `compileKotlin` 태스크에서 의존성을 생성하십시오.

```groovy
compileKotlin.configure {
  dependsOn "generateMainDatabaseMigrations"
}