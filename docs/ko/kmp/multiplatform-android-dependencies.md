[//]: # (title: Android 의존성 추가하기)

Kotlin Multiplatform 모듈에 Android 전용 의존성을 추가하는 워크플로우는 순수 Android 프로젝트와 동일합니다. Gradle 파일에 의존성을 선언하고 프로젝트를 임포트하세요. 그 후, Kotlin 코드에서 이 의존성을 사용할 수 있습니다.

Kotlin Multiplatform 프로젝트에서 Android 의존성을 선언할 때는 특정 Android 소스 세트(source set)에 추가하는 것을 권장합니다. 이를 위해 프로젝트의 `shared` 디렉토리에 있는 `build.gradle(.kts)` 파일을 업데이트하세요:

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        androidMain.dependencies {
            implementation("com.example.android:app-magic:12.3")
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
        androidMain {
            dependencies {
                implementation 'com.example.android:app-magic:12.3'
            }
        }
    }
}
```

</TabItem>
</Tabs>

Android 프로젝트의 최상위(top-level) 의존성을 멀티플랫폼 프로젝트의 특정 소스 세트로 옮기는 작업은, 해당 최상위 의존성이 단순하지 않은 구성 이름(configuration name)을 가진 경우 어려울 수 있습니다. 예를 들어, Android 프로젝트의 최상위 레벨에서 `debugImplementation` 의존성을 옮기려면, `androidDebug`라는 이름의 소스 세트에 implementation 의존성을 추가해야 합니다. 이러한 마이그레이션 문제를 처리하는 데 드는 노력을 최소화하기 위해, `android {}` 블록 안에 `dependencies {}` 블록을 추가할 수 있습니다:

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    android {
        //...
        dependencies {
            implementation("com.example.android:app-magic:12.3")
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    android {
        //...
        dependencies {
            implementation 'com.example.android:app-magic:12.3'
        }
    }
}
```

</TabItem>
</Tabs>

이곳에 선언된 의존성은 최상위 블록의 의존성과 완전히 동일하게 취급되지만, 이 방식으로 선언하면 빌드 스크립트에서 Android 의존성을 시각적으로 분리하여 혼동을 줄일 수 있습니다.

Android 프로젝트에서 관용적으로 사용하는 방식인 스크립트 끝부분의 독립된 `dependencies {}` 블록에 의존성을 넣는 것도 지원됩니다. 하지만 최상위 블록에 Android 의존성을 구성하고 각 소스 세트에 다른 타겟 의존성을 구성하는 것은 혼동을 야기할 가능성이 높으므로 이 방식은 권장하지 **않습니다**.

## 다음 단계는?

멀티플랫폼 프로젝트의 의존성 추가에 관한 다른 리소스를 확인하고 다음에 대해 더 알아보세요:

* [Android 공식 문서의 의존성 추가하기](https://developer.android.com/studio/build/dependencies)
* [멀티플랫폼 라이브러리 또는 기타 멀티플랫폼 프로젝트에 의존성 추가하기](multiplatform-add-dependencies.md)
* [iOS 의존성 추가하기](multiplatform-ios-dependencies.md)