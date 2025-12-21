[//]: # (title: Dokka Gradle 문제 해결)

이 페이지에서는 Gradle 빌드에서 Dokka를 사용하여 문서를 생성할 때 발생할 수 있는 일반적인 문제에 대해 설명합니다.

여기에 문제가 나와 있지 않다면, [이슈 트래커](https://kotl.in/dokka-issues)에 피드백이나 문제를 보고하거나 공식 [Kotlin Slack](https://kotlinlang.slack.com/)에서 Dokka 커뮤니티와 채팅하세요. Slack 초대 링크는 [여기](https://kotl.in/slack)에서 얻을 수 있습니다.

## 메모리 문제

대규모 프로젝트에서 Dokka는 문서를 생성하기 위해 상당한 양의 메모리를 소비할 수 있습니다. 특히 대량의 데이터를 처리할 때, 이는 Gradle의 메모리 제한을 초과할 수 있습니다.

Dokka 생성이 메모리 부족으로 실행되지 않으면 빌드가 실패하고, Gradle은 `java.lang.OutOfMemoryError: Metaspace`와 같은 예외를 발생시킬 수 있습니다.

일부 제한 사항은 Gradle에서 비롯되지만, Dokka의 성능을 개선하기 위한 노력이 활발히 진행 중입니다.

메모리 문제가 발생하면 다음 해결 방법을 시도해 보세요:

*   [힙 공간 늘리기](#increase-heap-space)
*   [Gradle 프로세스 내에서 Dokka 실행하기](#run-dokka-within-the-gradle-process)

### 힙 공간 늘리기

메모리 문제를 해결하는 한 가지 방법은 Dokka 생성기 프로세스에 할당된 Java 힙 메모리 양을 늘리는 것입니다. `build.gradle.kts` 파일에서 다음 구성 옵션을 조정하세요:

```kotlin
    dokka {
        // Dokka generates a new process managed by Gradle
        dokkaGeneratorIsolation = ProcessIsolation {
            // Configures heap size
            maxHeapSize = "4g"
        }
    }
```

이 예시에서는 최대 힙 크기가 4GB(`"4g"`)로 설정됩니다. 빌드에 최적의 설정을 찾기 위해 값을 조정하고 테스트하세요.

Dokka에 상당히 확장된 힙 크기(예: Gradle 자체의 메모리 사용량보다 훨씬 높음)가 필요하다고 판단되면, [Dokka GitHub 저장소에 이슈를 생성하세요](https://kotl.in/dokka-issues).

> 이 구성은 각 서브프로젝트에 적용해야 합니다. 모든 서브프로젝트에 적용되는 컨벤션 플러그인에서 Dokka를 구성하는 것이 좋습니다.
>
{style="note"}

### Gradle 프로세스 내에서 Dokka 실행하기

Gradle 빌드와 Dokka 생성이 모두 많은 메모리를 필요로 할 때, 이들은 별도의 프로세스로 실행되어 단일 머신에서 상당한 메모리를 소비할 수 있습니다.

메모리 사용량을 최적화하려면, Dokka를 별도의 프로세스로 실행하는 대신 동일한 Gradle 프로세스 내에서 실행할 수 있습니다. 이렇게 하면 각 프로세스에 개별적으로 메모리를 할당하는 대신, Gradle에 대한 메모리를 한 번만 구성할 수 있습니다.

동일한 Gradle 프로세스 내에서 Dokka를 실행하려면, `build.gradle.kts` 파일에서 다음 구성 옵션을 조정하세요:

```kotlin
    dokka {
        // Runs Dokka in the current Gradle process
        dokkaGeneratorIsolation = ClassLoaderIsolation()
    }
```

[힙 공간 늘리기](#increase-heap-space)와 마찬가지로, 이 구성이 프로젝트에 잘 작동하는지 확인하기 위해 테스트하세요.

Gradle의 JVM 메모리 구성에 대한 자세한 내용은 [Gradle 문서](https://docs.gradle.org/current/userguide/config_gradle.html#sec:configuring_jvm_memory)를 참조하세요.

> Gradle의 Java 옵션을 변경하면 새로운 Gradle 데몬이 시작되며, 이 데몬은 오랫동안 활성 상태를 유지할 수 있습니다. [다른 Gradle 프로세스를 수동으로 중지](https://docs.gradle.org/current/userguide/gradle_daemon.html#sec:stopping_an_existing_daemon)할 수 있습니다.
>
> 또한, `ClassLoaderIsolation()` 구성과 관련된 Gradle 이슈는 [메모리 누수를 유발](https://github.com/gradle/gradle/issues/18313)할 수 있습니다.
>
{style="note"}