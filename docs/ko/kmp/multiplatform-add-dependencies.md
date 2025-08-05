[//]: # (title: 멀티플랫폼 라이브러리에 종속성 추가하기)

모든 프로그램은 성공적으로 동작하기 위해 라이브러리 세트가 필요합니다. Kotlin 멀티플랫폼 프로젝트는 모든 대상 플랫폼에서 작동하는 멀티플랫폼 라이브러리, 플랫폼별 라이브러리, 그리고 다른 멀티플랫폼 프로젝트에 종속될 수 있습니다.

라이브러리에 종속성을 추가하려면, 공유 코드(shared code)가 포함된 프로젝트 디렉터리에 있는 `build.gradle(.kts)` 파일을 업데이트하세요. 필요한 [종속성 유형](https://kotlinlang.org/docs/gradle-configure-project.html#dependency-types) (예: `implementation`)을 [`dependencies {}`](multiplatform-dsl-reference.md#dependencies) 블록에 설정하세요.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            implementation("com.example:my-library:1.0") // 모든 소스 세트에 공유되는 라이브러리
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                implementation 'com.example:my-library:1.0'
            }
        }
    }
}
```

</tab>
</tabs>

또는, [최상위 레벨에서 종속성을 설정](https://kotlinlang.org/docs/gradle-configure-project.html#set-dependencies-at-top-level)할 수도 있습니다.

## Kotlin 라이브러리에 대한 종속성

### 표준 라이브러리

각 소스 세트의 표준 라이브러리(`stdlib`) 종속성은 자동으로 추가됩니다. 표준 라이브러리 버전은 `kotlin-multiplatform` 플러그인 버전과 동일합니다.

플랫폼별 소스 세트의 경우, 해당 플랫폼별 라이브러리 변형이 사용되며, 나머지에는 공통 표준 라이브러리가 추가됩니다. Kotlin Gradle 플러그인은 Gradle 빌드 스크립트의 `compilerOptions.jvmTarget` [컴파일러 옵션](https://kotlinlang.org/docs/gradle-compiler-options.html)에 따라 적절한 JVM 표준 라이브러리를 선택합니다.

[기본 동작 변경](https://kotlinlang.org/docs/gradle-configure-project.html#dependency-on-the-standard-library) 방법에 대해 알아보세요.

### 테스트 라이브러리

멀티플랫폼 테스트의 경우, [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API를 사용할 수 있습니다. 멀티플랫폼 프로젝트를 생성할 때, `commonTest`에 단일 종속성을 사용하여 모든 소스 세트에 테스트 종속성을 추가할 수 있습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonTest.dependencies {
            implementation(kotlin("test")) // 모든 플랫폼 종속성을 자동으로 가져옵니다.
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // 모든 플랫폼 종속성을 자동으로 가져옵니다.
            }
        }
    }
}
```

</tab>
</tabs>

### kotlinx 라이브러리

멀티플랫폼 라이브러리를 사용하고 [공유 코드에 종속](#library-shared-for-all-source-sets)되어야 하는 경우, 공유 소스 세트에 종속성을 한 번만 설정하세요. `kotlinx-coroutines-core`와 같은 라이브러리 기본 아티팩트 이름을 사용하세요.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
```

</tab>
</tabs>

[플랫폼별 종속성](#library-used-in-specific-source-sets)을 위해 kotlinx 라이브러리가 필요한 경우에도, 해당 플랫폼 소스 세트에서 라이브러리의 기본 아티팩트 이름을 사용할 수 있습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        jvmMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        jvmMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
```

</tab>
</tabs>

## Kotlin 멀티플랫폼 라이브러리에 대한 종속성

[SQLDelight](https://github.com/cashapp/sqldelight)와 같이 Kotlin 멀티플랫폼 기술을 채택한 라이브러리에 종속성을 추가할 수 있습니다. 이러한 라이브러리 개발자들은 일반적으로 프로젝트에 종속성을 추가하는 방법에 대한 가이드를 제공합니다.

> [JetBrains 검색 플랫폼](https://klibs.io/)에서 Kotlin 멀티플랫폼 라이브러리를 찾아보세요.
>
{style="tip"}

### 모든 소스 세트에 공유되는 라이브러리

모든 소스 세트에서 라이브러리를 사용하려면, 공통 소스 세트에만 추가하면 됩니다. Kotlin Multiplatform Mobile 플러그인은 해당 부분을 다른 소스 세트에 자동으로 추가합니다.

> 공통 소스 세트에는 플랫폼별 라이브러리에 대한 종속성을 설정할 수 없습니다.
>
{style="warning"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            implementation("io.ktor:ktor-client-core:%ktorVersion%")
        }
        androidMain.dependencies {
            // ktor-client의 플랫폼 부분에 대한 종속성이 자동으로 추가됩니다.
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                implementation 'io.ktor:ktor-client-core:%ktorVersion%'
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

</tab>
</tabs>

### 특정 소스 세트에서 사용되는 라이브러리

특정 소스 세트에서만 멀티플랫폼 라이브러리를 사용하려면, 해당 소스 세트에만 독점적으로 추가할 수 있습니다. 그러면 지정된 라이브러리 선언은 해당 소스 세트에서만 사용 가능합니다.

> 이 경우 플랫폼별 라이브러리 이름이 아닌 일반 라이브러리 이름을 사용하세요. 아래 예시의 SQLDelight처럼, `native-driver`를 사용하고 `native-driver-iosx64`를 사용하지 마세요. 정확한 이름은 라이브러리 문서를 참조하세요.
>
{style="note"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            // kotlinx.coroutines는 모든 소스 세트에서 사용 가능합니다.
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
        androidMain.dependencies {

        }
        iosMain.dependencies {
            // SQLDelight는 iOS 소스 세트에서만 사용 가능하며, Android 또는 common에서는 사용 불가능합니다.
            implementation("com.squareup.sqldelight:native-driver:%sqlDelightVersion%")
        }
        wasmJsMain.dependencies {
            
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                // kotlinx.coroutines는 모든 소스 세트에서 사용 가능합니다.
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
        androidMain {
            dependencies {}
        }
        iosMain {
            dependencies {
                // SQLDelight는 iOS 소스 세트에서만 사용 가능하며, Android 또는 common에서는 사용 불가능합니다.
                implementation 'com.squareup.sqldelight:native-driver:%sqlDelightVersion%'
            }
        }
        wasmJsMain {
            dependencies {}
        }
    }
}
```

</tab>
</tabs>

## 다른 멀티플랫폼 프로젝트에 대한 종속성

하나의 멀티플랫폼 프로젝트를 다른 프로젝트에 종속성으로 연결할 수 있습니다. 이를 위해, 필요한 소스 세트에 프로젝트 종속성을 추가하기만 하면 됩니다. 모든 소스 세트에서 종속성을 사용하려면, 공통 소스 세트에 추가하세요. 이 경우, 다른 소스 세트는 자동으로 버전을 가져옵니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
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

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
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

</tab>
</tabs>

## 다음은 무엇인가요?

멀티플랫폼 프로젝트에 종속성을 추가하는 방법에 대한 다른 자료를 확인하고 다음에 대해 자세히 알아보세요:

* [Android 종속성 추가하기](multiplatform-android-dependencies.md)
* [iOS 종속성 추가하기](multiplatform-ios-dependencies.md)
* [iOS, Android, 데스크톱, 웹을 대상으로 하는 Compose Multiplatform 프로젝트에 종속성 추가하기](compose-multiplatform-modify-project.md#add-a-new-dependency)