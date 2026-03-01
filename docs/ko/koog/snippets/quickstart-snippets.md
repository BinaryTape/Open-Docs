---
search:
exclude: true
---

# --8<-- [start:prerequisites]
환경과 프로젝트가 다음 요구 사항을 충족하는지 확인하세요:

- JDK 17+
- Kotlin 2.2.0+
- Gradle 8.0+ 또는 Maven 3.8+
# --8<-- [end:prerequisites]

# --8<-- [start:dependencies]
[Koog 패키지](https://central.sonatype.com/artifact/ai.koog/koog-agents/)를 의존성으로 추가하세요:

=== "Gradle (Kotlin)"

    ``` kotlin title="build.gradle.kts"
    dependencies {
        implementation("ai.koog:koog-agents:0.6.0")
    }
    ```

=== "Gradle (Groovy)"

    ``` groovy title="build.gradle"
    dependencies {
        implementation 'ai.koog:koog-agents:0.6.0'
    }
    ```

=== "Maven"

    ```xml title="pom.xml"
    <dependency>
        <groupId>ai.koog</groupId>
        <artifactId>koog-agents-jvm</artifactId>
        <version>0.6.0</version>
    </dependency>
    ```
# --8<-- [end:dependencies]

# --8<-- [start:api-key]
LLM 제공업체로부터 API 키를 발급받거나 Ollama를 통해 로컬 LLM을 실행하세요.
자세한 내용은 [Quickstart](/quickstart.md)를 참고하세요.
# --8<-- [end:api-key]