[//]: # (title: 멀티플랫폼 라이브러리 종속성 추가)

모든 프로그램은 성공적으로 작동하기 위해 일련의 라이브러리가 필요합니다. Kotlin 멀티플랫폼 프로젝트는 모든 대상 플랫폼에서 작동하는 멀티플랫폼 라이브러리, 플랫폼별 라이브러리, 그리고 다른 멀티플랫폼 프로젝트에 종속될 수 있습니다.

라이브러리 종속성을 추가하려면 공유 코드를 포함하는 프로젝트 디렉터리에 있는 `build.gradle(.kts)` 파일을 업데이트하세요. 필요한 [유형](https://kotlinlang.org/docs/gradle-configure-project.html#dependency-types)(예: `implementation`)의 종속성을 [`dependencies {}`](multiplatform-dsl-reference.md#dependencies) 블록에 설정하세요:

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            implementation("com.example:my-library:1.0") // library shared for all source sets
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

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

</TabItem>
</Tabs>

## Kotlin 라이브러리 종속성

### 표준 라이브러리

각 소스 세트의 표준 라이브러리(`stdlib`) 종속성은 자동으로 추가됩니다. 표준 라이브러리 버전은 `kotlin-multiplatform` 플러그인 버전과 동일합니다.

플랫폼별 소스 세트의 경우 해당 플랫폼별 라이브러리 변형이 사용되며, 나머지에는 공통 표준 라이브러리가 추가됩니다. Kotlin Gradle 플러그인은 Gradle 빌드 스크립트의 `compilerOptions.jvmTarget` [컴파일러 옵션](https://kotlinlang.org/docs/gradle-compiler-options.html)에 따라 적절한 JVM 표준 라이브러리를 선택합니다.

[기본 동작을 변경하는 방법](https://kotlinlang.org/docs/gradle-configure-project.html#dependency-on-the-standard-library)을 알아보세요.

### 테스트 라이브러리

멀티플랫폼 테스트의 경우 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API를 사용할 수 있습니다. 멀티플랫폼 프로젝트를 생성할 때 `commonTest`에 단일 종속성을 사용하여 모든 소스 세트에 테스트 종속성을 추가할 수 있습니다:

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonTest.dependencies {
            implementation(kotlin("test")) // Brings all the platform dependencies automatically
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // Brings all the platform dependencies automatically
            }
        }
    }
}
```

</TabItem>
</Tabs>

### kotlinx 라이브러리

멀티플랫폼 라이브러리를 사용하고 [공유 코드에 종속](#library-shared-for-all-source-sets)되어야 하는 경우, 공유 소스 세트에 종속성을 한 번만 설정하세요. 예를 들어 `kotlinx-coroutines-core`와 같이 라이브러리 기본 아티팩트 이름을 사용하세요:

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

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

</TabItem>
<TabItem title="Groovy" group-key="groovy">

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

</TabItem>
</Tabs>

[플랫폼별 종속성](#library-used-in-specific-source-sets)을 위해 kotlinx 라이브러리가 필요한 경우에도 해당 플랫폼 소스 세트에서 라이브러리의 기본 아티팩트 이름을 사용할 수 있습니다:

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

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

</TabItem>
<TabItem title="Groovy" group-key="groovy">

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

</TabItem>
</Tabs>

## Kotlin 멀티플랫폼 라이브러리 종속성

[SQLDelight](https://github.com/cashapp/sqldelight)과 같이 Kotlin 멀티플랫폼 기술을 채택한 라이브러리에 종속성을 추가할 수 있습니다. 이러한 라이브러리의 작성자는 일반적으로 프로젝트에 종속성을 추가하는 방법에 대한 가이드를 제공합니다.

> [JetBrains 검색 플랫폼](https://klibs.io/)에서 Kotlin 멀티플랫폼 라이브러리를 찾아보세요.
>
{style="tip"}

### 모든 소스 세트에서 공유되는 라이브러리

모든 소스 세트에서 라이브러리를 사용하려면 공통 소스 세트에만 추가하면 됩니다. Kotlin Multiplatform Mobile 플러그인은 해당 부분을 다른 소스 세트에 자동으로 추가합니다.

> 공통 소스 세트에서는 플랫폼별 라이브러리에 종속성을 설정할 수 없습니다.
>
{style="warning"}

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            implementation("io.ktor:ktor-client-core:%ktorVersion%")
        }
        androidMain.dependencies {
            // dependency to a platform part of ktor-client will be added automatically
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

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
                // dependency to platform part of ktor-client will be added automatically
            }
        }
    }
}
```

</TabItem>
</Tabs>

### 특정 소스 세트에서 사용되는 라이브러리

특정 소스 세트에서만 멀티플랫폼 라이브러리를 사용하려면 해당 소스 세트에만 독점적으로 추가할 수 있습니다. 그러면 지정된 라이브러리 선언은 해당 소스 세트에서만 사용할 수 있습니다.

> 이러한 경우 플랫폼별 라이브러리 이름이 아닌 공통 라이브러리 이름을 사용하세요. 아래 예시의 SQLDelight와 같이 `native-driver`를 사용하고 `native-driver-iosx64`는 사용하지 마세요. 정확한 이름은 라이브러리 문서를 참조하세요.
>
{style="note"}

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            // kotlinx.coroutines will be available in all source sets
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
        androidMain.dependencies {

        }
        iosMain.dependencies {
            // SQLDelight will be available only in the iOS source set, but not in Android or common
            implementation("com.squareup.sqldelight:native-driver:%sqlDelightVersion%")
        }
        wasmJsMain.dependencies {
            
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                // kotlinx.coroutines will be available in all source sets
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
        androidMain {
            dependencies {}
        }
        iosMain {
            dependencies {
                // SQLDelight will be available only in the iOS source set, but not in Android or common
                implementation 'com.squareup.sqldelight:native-driver:%sqlDelightVersion%'
            }
        }
        wasmJsMain {
            dependencies {}
        }
    }
}
```

</TabItem>
</Tabs>

## 다른 멀티플랫폼 프로젝트 종속성

하나의 멀티플랫폼 프로젝트를 다른 프로젝트에 종속성으로 연결할 수 있습니다. 이를 위해서는 필요한 소스 세트에 프로젝트 종속성을 추가하기만 하면 됩니다. 모든 소스 세트에서 종속성을 사용하려면 공통 소스 세트에 추가하세요. 이 경우 다른 소스 세트는 자동으로 해당 버전을 가져옵니다.

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            implementation(project(":some-other-multiplatform-module"))
        }
        androidMain.dependencies {
            // platform part of :some-other-multiplatform-module will be added automatically
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

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
                // platform part of :some-other-multiplatform-module will be added automatically
            }
        }
    }
}
```

</TabItem>
</Tabs>

## 다음 단계는 무엇인가요?

멀티플랫폼 프로젝트에서 종속성을 추가하는 다른 자료를 확인하고 다음 내용에 대해 자세히 알아보세요:

*   [Android 종속성 추가](multiplatform-android-dependencies.md)
*   [iOS 종속성 추가](multiplatform-ios-dependencies.md)
*   [iOS, Android, 데스크톱, 웹을 대상으로 하는 Compose Multiplatform 프로젝트에서 종속성 추가](compose-multiplatform-modify-project.md#add-a-new-dependency)