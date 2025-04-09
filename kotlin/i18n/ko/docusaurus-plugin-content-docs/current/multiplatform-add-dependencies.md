---
title: "멀티플랫폼 라이브러리에 대한 종속성 추가"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

모든 프로그램은 성공적으로 작동하기 위해 라이브러리 집합이 필요합니다. Kotlin Multiplatform 프로젝트는 모든 대상 플랫폼에서 작동하는 멀티플랫폼 라이브러리, 플랫폼별 라이브러리 및 기타 멀티플랫폼 프로젝트에 의존할 수 있습니다.

라이브러리에 대한 종속성을 추가하려면 공유 코드가 포함된 프로젝트 디렉터리에서 `build.gradle(.kts)` 파일을 업데이트하세요. 필요한 [유형](gradle-configure-project#dependency-types) (예: `implementation`)의 종속성을 [`dependencies {}`](multiplatform-dsl-reference#dependencies) 블록에 설정합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("com.example:my-library:1.0") // 모든 소스 세트에 대해 공유되는 라이브러리
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'com.example:my-library:1.0'
            }
        }
    }
}
```

</TabItem>
</Tabs>

또는 [최상위 수준에서 종속성을 설정](gradle-configure-project#set-dependencies-at-top-level)할 수 있습니다.

## Kotlin 라이브러리에 대한 종속성

### 표준 라이브러리

각 소스 세트에서 표준 라이브러리(`stdlib`)에 대한 종속성이 자동으로 추가됩니다. 표준 라이브러리 버전은 `kotlin-multiplatform` 플러그인의 버전과 동일합니다.

플랫폼별 소스 세트의 경우 해당 플랫폼별 라이브러리 변형이 사용되는 반면, 공통 표준 라이브러리는 나머지에 추가됩니다. Kotlin Gradle 플러그인은 Gradle 빌드 스크립트의 `compilerOptions.jvmTarget` [컴파일러 옵션](gradle-compiler-options)에 따라 적절한 JVM 표준 라이브러리를 선택합니다.

[기본 동작을 변경하는 방법](gradle-configure-project#dependency-on-the-standard-library)을 알아보세요.

### 테스트 라이브러리

멀티플랫폼 테스트의 경우 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API를 사용할 수 있습니다. 멀티플랫폼 프로젝트를 생성할 때 `commonTest`에서 단일 종속성을 사용하여 모든 소스 세트에 테스트 종속성을 추가할 수 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonTest.dependencies {
            implementation(kotlin("test")) // 모든 플랫폼 종속성을 자동으로 가져옴
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // 모든 플랫폼 종속성을 자동으로 가져옴
            }
        }
    }
}
```

</TabItem>
</Tabs>

### kotlinx 라이브러리

멀티플랫폼 라이브러리를 사용하고 [공유 코드에 의존](#library-shared-for-all-source-sets)해야 하는 경우 공유 소스 세트에서만 종속성을 설정합니다. `kotlinx-coroutines-core`와 같은 라이브러리 기본 아티팩트 이름을 사용합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1'
            }
        }
    }
}
```

</TabItem>
</Tabs>

[플랫폼별 종속성](#library-used-in-specific-source-sets)에 kotlinx 라이브러리가 필요한 경우 해당 플랫폼 소스 세트에서 라이브러리 기본 아티팩트 이름을 계속 사용할 수 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        jvmMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        jvmMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1'
            }
        }
    }
}
```

</TabItem>
</Tabs>

## Kotlin Multiplatform 라이브러리에 대한 종속성

[SQLDelight](https://github.com/cashapp/sqldelight)와 같이 Kotlin Multiplatform 기술을 채택한 라이브러리에 종속성을 추가할 수 있습니다. 이러한 라이브러리 작성자는 일반적으로 프로젝트에 종속성을 추가하기 위한 가이드를 제공합니다.

:::note
[JetBrains의 검색 플랫폼](https://klibs.io/)에서 Kotlin Multiplatform 라이브러리를 찾아보세요.

### 모든 소스 세트에 대해 공유되는 라이브러리

모든 소스 세트에서 라이브러리를 사용하려면 공통 소스 세트에만 추가하면 됩니다. Kotlin Multiplatform Mobile 플러그인은 해당 부분을 다른 소스 세트에 자동으로 추가합니다.

공통 소스 세트에서 플랫폼별 라이브러리에 대한 종속성을 설정할 수 없습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("io.ktor:ktor-client-core:3.1.1")
        }
        androidMain.dependencies {
            // ktor-client의 플랫폼 부분에 대한 종속성이 자동으로 추가됩니다.
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'io.ktor:ktor-client-core:3.1.1'
            }
        }
        androidMain {
            dependencies {
                // ktor-client의 플랫폼 부분에 대한 종속성이 자동으로 추가됩니다.
            }
        }
    }
}
```

</TabItem>
</Tabs>

### 특정 소스 세트에서 사용되는 라이브러리

특정 소스 세트에 대해서만 멀티플랫폼 라이브러리를 사용하려면 해당 라이브러리에만 배타적으로 추가할 수 있습니다. 지정된 라이브러리 선언은 해당 소스 세트에서만 사용할 수 있습니다.

이러한 경우 플랫폼별 라이브러리가 아닌 공통 라이브러리 이름을 사용하세요. 아래 예에서 SQLDelight와 마찬가지로 `native-driver-iosx64`가 아닌 `native-driver`를 사용하세요. 라이브러리 설명서에서 정확한 이름을 찾으세요.

:::

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            // kotlinx.coroutines는 모든 소스 세트에서 사용할 수 있습니다.
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
        }
        androidMain.dependencies {

        }
        iosMain.dependencies {
            // SQLDelight는 iOS 소스 세트에서만 사용할 수 있지만 Android 또는 공통에서는 사용할 수 없습니다.
            implementation("com.squareup.sqldelight:native-driver:2.0.2")
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                // kotlinx.coroutines는 모든 소스 세트에서 사용할 수 있습니다.
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1'
            }
        }
        androidMain {
            dependencies {}
        }
        iosMain {
            dependencies {
                // SQLDelight는 iOS 소스 세트에서만 사용할 수 있지만 Android 또는 공통에서는 사용할 수 없습니다.
                implementation 'com.squareup.sqldelight:native-driver:2.0.2'
            }
        }
    }
}
```

</TabItem>
</Tabs>

## 다른 멀티플랫폼 프로젝트에 대한 종속성

하나의 멀티플랫폼 프로젝트를 다른 프로젝트에 종속성으로 연결할 수 있습니다. 이렇게 하려면 필요한 소스 세트에 프로젝트 종속성을 추가하기만 하면 됩니다. 모든 소스 세트에서 종속성을 사용하려면 공통 소스 세트에 추가합니다. 이 경우 다른 소스 세트는 해당 버전을 자동으로 가져옵니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation(project(":some-other-multiplatform-module"))
        }
        androidMain.dependencies {
            // :some-other-multiplatform-module의 플랫폼 부분이 자동으로 추가됩니다.
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation project(':some-other-multiplatform-module')
            }
        }
        androidMain {
            dependencies {
                // :some-other-multiplatform-module의 플랫폼 부분이 자동으로 추가됩니다.
            }
        }
    }
}
```

</TabItem>
</Tabs>

## 다음 단계는 무엇인가요?

멀티플랫폼 프로젝트에서 종속성을 추가하는 방법에 대한 다른 리소스를 확인하고 다음 사항에 대해 자세히 알아보세요.

* [Android 종속성 추가](multiplatform-android-dependencies)
* [iOS 종속성 추가](multiplatform-ios-dependencies)

  ```