[//]: # (title: 연산 인자)

이 튜토리얼에서는 연산 인자를 구성하는 방법을 배웁니다.

아래의 간단한 `MultiMap` 구현을 살펴보세요. 이 구현은 `ConcurrentHashMap`을 기반으로 하며, 내부적으로 값 목록을 저장합니다:

```kotlin
import java.util.concurrent.*

class MultiMap<K, V> {
    private val map = ConcurrentHashMap<K, List<V>>()
   
    // Maintains a list of values 
    // associated with the specified key.
    fun add(key: K, value: V) {
        val list = map[key]
        if (list == null) {
            map[key] = listOf(value)
        } else {
            map[key] = list + value
        }
    }

    fun get(key: K): List<V> = map[key] ?: emptyList()
}
```

이 `MultiMap` 구현은 선형화 가능할까요? 만약 그렇지 않다면, 작은 범위의 키에 접근할 때 잘못된 인터리빙이 감지될 가능성이 더 높으며, 이는 동일한 키를 동시에 처리할 가능성을 높입니다.

이를 위해 `key: Int` 매개변수에 대한 제너레이터를 구성합니다:

1.  `@Param` 어노테이션을 선언합니다.
2.  정수 제너레이터 클래스를 지정합니다: `@Param(gen = IntGen::class)`.
    Lincheck은 거의 모든 기본 타입과 문자열에 대해 기본적으로 랜덤 매개변수 제너레이터를 지원합니다.
3.  문자열 구성 `@Param(conf = "1:2")`로 생성되는 값의 범위를 정의합니다.
4.  여러 연산에서 공유하도록 매개변수 구성 이름(`@Param(name = "key")`)을 지정합니다.

    아래는 `MultiMap`에 대한 스트레스 테스트로, `add(key, value)` 및 `get(key)` 연산에 사용할 키를 `[1..2]` 범위에서 생성합니다: 
    
    ```kotlin
    import java.util.concurrent.*
    import org.jetbrains.lincheck.check
    import org.jetbrains.lincheck.datastructures.*
    import org.junit.*
    
    class MultiMap<K, V> {
        private val map = ConcurrentHashMap<K, List<V>>()
    
        // Maintains a list of values 
        // associated with the specified key.
        fun add(key: K, value: V) {
            val list = map[key]
            if (list == null) {
                map[key] = listOf(value)
            } else {
                map[key] = list + value
            }
        }

        fun get(key: K): List<V> = map[key] ?: emptyList()
    }
    
    @Param(name = "key", gen = IntGen::class, conf = "1:2")
    class MultiMapTest {
        private val map = MultiMap<Int, Int>()
    
        @Operation
        fun add(@Param(name = "key") key: Int, value: Int) = map.add(key, value)
    
        @Operation
        fun get(@Param(name = "key") key: Int) = map.get(key)
    
        @Test
        fun stressTest() = StressOptions().check(this::class)
    
        @Test
        fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
    }
    ```

5.  `stressTest()`를 실행하면 다음과 같은 출력을 확인할 수 있습니다:

    ```text
    = Invalid execution results =
    | ---------------------------------- |
    |    Thread 1     |     Thread 2     |
    | ---------------------------------- |
    | add(2, 0): void | add(2, -1): void |
    | ---------------------------------- |
    | get(2): [0]     |                  |
    | ---------------------------------- |
    ```
    
6.  마지막으로 `modelCheckingTest()`를 실행합니다. 다음 출력과 함께 실패합니다:

    ```text
    = Invalid execution results =
    | ---------------------------------- |
    |    Thread 1     |     Thread 2     |
    | ---------------------------------- |
    | add(2, 0): void | add(2, -1): void |
    | ---------------------------------- |
    | get(2): [-1]    |                  |
    | ---------------------------------- |
    
    ---
    All operations above the horizontal line | ----- | happen before those below the line
    ---

    The following interleaving leads to the error:
    | ---------------------------------------------------------------------- |
    |    Thread 1     |                       Thread 2                       |
    | ---------------------------------------------------------------------- |
    |                 | add(2, -1)                                           |
    |                 |   add(2,-1) at MultiMapTest.add(MultiMap.kt:31)      |
    |                 |     get(2): null at MultiMap.add(MultiMap.kt:15)     |
    |                 |     switch                                           |
    | add(2, 0): void |                                                      |
    |                 |     put(2,[-1]): [0] at MultiMap.add(MultiMap.kt:17) |
    |                 |   result: void                                       |
    | ---------------------------------------------------------------------- |
    ```

키 범위가 작기 때문에 Lincheck은 경합 상태를 빠르게 밝혀냅니다. 동일한 키로 두 값이 동시에 추가될 때, 값 중 하나가 덮어쓰여지고 손실될 수 있습니다.

## 다음 단계

[실행에 대한 접근 제약](constraints.md)을 설정하는 데이터 구조(예: 단일 생산자 단일 소비자 큐)를 테스트하는 방법을 알아봅니다.