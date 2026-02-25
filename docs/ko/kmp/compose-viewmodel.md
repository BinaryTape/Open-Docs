[//]: # (title: 공통 ViewModel)

UI를 빌드하는 Android의 [ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel) 방식은 Compose Multiplatform을 사용하여 공통 코드(common code)에서도 구현할 수 있습니다.

## 프로젝트에 공통 ViewModel 추가하기

멀티플랫폼 `ViewModel` 구현을 사용하려면 `commonMain` 소스 세트에 다음 종속성을 추가하세요:

```kotlin
kotlin {
    // ...
    sourceSets {
        // ...
        commonMain.dependencies {
            // ...
            implementation("org.jetbrains.androidx.lifecycle:lifecycle-viewmodel-compose:%org.jetbrains.androidx.lifecycle%")
        }
        // ...
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="org.jetbrains.androidx.lifecycle:lifecycle-viewmodel-compose:%org.jetbrains.androidx.lifecycle%"}

## 공통 코드에서 ViewModel 사용하기

Compose Multiplatform은 공통 `ViewModelStoreOwner` 인터페이스를 구현하므로, 공통 코드에서 `ViewModel` 클래스를 사용하는 방식은 일반적으로 Android의 권장 사례(best practices)와 크게 다르지 않습니다.

[내비게이션 예제](https://github.com/JetBrains/compose-multiplatform/tree/0e38f58b42d23ff6d0ad30b119d34fa1cd6ccedb/examples/nav_cupcake)를 사용하여 살펴보겠습니다:

1. ViewModel 클래스를 선언합니다:

```kotlin
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewmodel.compose.viewModel

class OrderViewModel : ViewModel() {
   private val _uiState = MutableStateFlow(OrderUiState(pickupOptions = pickupOptions()))
   val uiState: StateFlow<OrderUiState> = _uiState.asStateFlow()
   // ...
}
```

2. 컴포저블(composable) 함수에 ViewModel을 추가합니다:

```kotlin
@Composable
fun CupcakeApp(
   viewModel: OrderViewModel = viewModel { OrderViewModel() },
) {
   // ...
}
```

> `ViewModel`에서 코루틴을 실행할 때, `ViewModel.viewModelScope` 값은 `Dispatchers.Main.immediate` 값과 연결되어 있다는 점에 유의하세요. 이 값은 기본적으로 데스크톱 환경에서는 사용할 수 없을 수도 있습니다.
> Compose Multiplatform에서 ViewModel 코루틴이 올바르게 작동하도록 하려면 프로젝트에 `kotlinx-coroutines-swing` 종속성을 추가하세요.
> 자세한 내용은 [`Dispatchers.Main` 문서](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html)를 참고하세요.
> 
{style="tip"}

JVM 이외의 플랫폼에서는 타입 리플렉션(type reflection)을 사용하여 객체를 인스턴스화할 수 없습니다.
따라서 공통 코드에서는 매개변수 없이 `viewModel()` 함수를 호출할 수 없습니다. `ViewModel` 인스턴스를 생성할 때마다 최소한 초기화 함수(initializer)를 인자로 제공해야 합니다.

초기화 함수만 제공되는 경우, 라이브러리는 내부적으로 기본 팩토리를 생성합니다.
하지만 [Jetpack Compose와 마찬가지로](https://developer.android.com/topic/libraries/architecture/viewmodel#jetpack-compose) 직접 팩토리를 구현하고 더 명시적인 버전의 공통 `viewModel(...)` 함수를 호출할 수도 있습니다.