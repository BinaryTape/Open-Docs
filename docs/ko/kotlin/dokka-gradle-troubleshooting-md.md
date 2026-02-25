[//]: # (title: Dokka Gradle 문제 해결)

이 페이지는 Gradle 빌드에서 Dokka를 사용하여 문서를 생성할 때 발생할 수 있는 일반적인 문제들을 설명합니다.

문제가 여기에 나열되어 있지 않다면, [이슈 트래커](https://kotl.in/dokka-issues)에 의견이나 문제를 보고하거나 공식 [Kotlin Slack](https://kotlinlang.slack.com/)의 Dokka 커뮤니티에서 대화해 보세요. Slack 초대장은 [여기](https://kotl.in/slack)에서 받을 수 있습니다.

## 메모리 문제

대규모 프로젝트에서 Dokka는 문서를 생성하기 위해 상당한 양의 메모리를 사용할 수 있습니다. 특히 대량의 데이터를 처리할 때 Gradle의 메모리 제한을 초과할 수 있습니다.

Dokka 생성 시 메모리가 부족하면 빌드가 실패하며, Gradle은 `java.lang.OutOfMemoryError: Metaspace`와 같은 예외를 발생시킬 수 있습니다.

Dokka의 성능을 개선하기 위해 활발한 노력이 진행 중이지만, 일부 제한 사항은 Gradle에서 기인합니다.

메모리 문제가 발생하면 다음 해결 방법을 시도해 보세요:

* [힙 공간 늘리기](#increase-heap-space)
* [Gradle 프로세스 내에서 Dokka 실행하기](#run-dokka-within-the-gradle-process)

### 힙 공간 늘리기

메모리 문제를 해결하는 한 가지 방법은 Dokka 생성기(generator) 프로세스의 Java 힙(heap) 메모리 용량을 늘리는 것입니다. `build.gradle.kts` 파일에서 다음 설정 옵션을 조정하세요:

```kotlin
    dokka {
        // Gradle이 관리하는 새로운 프로세스를 생성합니다.
        dokkaGeneratorIsolation = ProcessIsolation {
            // 힙 크기를 설정합니다.
            maxHeapSize = "4g"
        }
    }
```

이 예제에서는 최대 힙 크기가 4 GB(`"4g"`)로 설정되어 있습니다. 빌드에 가장 적합한 설정을 찾기 위해 값을 조정하고 테스트해 보세요.

만약 Dokka가 Gradle 자체의 메모리 사용량보다 현저히 높은 수준의 힙 크기를 요구한다면, [Dokka GitHub 저장소에 이슈를 생성](https://kotl.in/dokka-issues)해 주세요.

> 이 설정은 각 서브프로젝트에 적용해야 합니다. 모든 서브프로젝트에 적용되는 컨벤션 플러그인(convention plugin)에서 Dokka를 구성하는 것을 권장합니다.
>
{style="note"}

### Gradle 프로세스 내에서 Dokka 실행하기

Gradle 빌드와 Dokka 생성 모두에 많은 메모리가 필요한 경우, 이들이 별도의 프로세스로 실행되어 단일 머신에서 상당한 메모리를 소모할 수 있습니다.

메모리 사용량을 최적화하려면 Dokka를 별도의 프로세스가 아닌 동일한 Gradle 프로세스 내에서 실행할 수 있습니다. 이렇게 하면 각 프로세스에 메모리를 별도로 할당하는 대신 Gradle용 메모리를 한 번만 설정하면 됩니다.

동일한 Gradle 프로세스 내에서 Dokka를 실행하려면 `build.gradle.kts` 파일에서 다음 설정 옵션을 조정하세요:

```kotlin
    dokka {
        // 현재 Gradle 프로세스 내에서 Dokka를 실행합니다.
        dokkaGeneratorIsolation = ClassLoaderIsolation()
    }
```

[힙 공간 늘리기](#increase-heap-space)와 마찬가지로, 이 설정이 프로젝트에서 잘 작동하는지 테스트하여 확인하세요.

Gradle의 JVM 메모리 구성에 대한 자세한 내용은 [Gradle 문서](https://docs.gradle.org/current/userguide/config_gradle.html#sec:configuring_jvm_memory)를 참조하세요.

> Gradle의 Java 옵션을 변경하면 새로운 Gradle 데몬(daemon)이 실행되며, 이는 오랫동안 유지될 수 있습니다. [다른 Gradle 프로세스를 수동으로 중지](https://docs.gradle.org/current/userguide/gradle_daemon.html#sec:stopping_an_existing_daemon)할 수 있습니다.
>
> 또한, `ClassLoaderIsolation()` 설정과 관련된 Gradle 이슈로 인해 [메모리 누수가 발생](https://github.com/gradle/gradle/issues/18313)할 수 있습니다.
>
{style="note"}