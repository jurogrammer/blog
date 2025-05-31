---
title: "Stream API Practice"
date: 2022-10-13
categories: ["Languages"]
tags: ["Languages", "FunctionalProgramming"]

---

Recently, I read the book Modern Java In Action. I was very impressed. I realized that when studying functional programming and the Java API, I should read books. Compared to Googling, books are much richer in content and much more reliable. After all, it was written by a Java Champion, two professors, and one engineer! Anyway, I will leave some code I wrote while studying the stream API.

And I will gradually share the ideas behind why I wrote the code this way.

[https://school.programmers.co.kr/learn/courses/30/lessons/92335](https://school.programmers.co.kr/learn/courses/30/lessons/92335)

```java
import java.util.Arrays;
import java.util.stream.LongStream;

public class Solution {
    public int solution(int n, int k) {

        return (int) Arrays.stream(toDigits(n, k).split("0"))
                .filter(strNum -> !strNum.isBlank())
                .map(Long::parseLong)
                .filter(this::isPrime)
                .count();

    }

    private String toDigits(int n, int digit) {
        StringBuilder sb = new StringBuilder();
        int num = n;
        while (num >= digit) {
            sb.append(num % digit);
            num = num / digit;
        }
        sb.append(num);
        return sb.reverse().toString();
    }


    private boolean isPrime(long n) {
        if (n <= 1) return false;

        return LongStream.range(2, (int) Math.sqrt(n) + 1)
                .noneMatch(candidate -> n % candidate == 0);
    }
}
```

[https://school.programmers.co.kr/learn/courses/30/lessons/92341](https://school.programmers.co.kr/learn/courses/30/lessons/92341)

```java
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static java.util.Comparator.comparingInt;
import static java.util.stream.Collectors.*;

public class Solution {
    public int[] solution(int[] fees, String[] records) {
        Map<String, List<Record>> recordByCarNum = Arrays.stream(records)
                .map(Record::of)
                .sorted(comparingInt(Record::getMins))
                .collect(groupingBy(Record::getCarNum));

        recordByCarNum.forEach((k, v) -> {
            if (v.size() % 2 != 0) v.add(new Record("23:59", k, "OUT"));
        });

        Map<String, Integer> feeByCarNum = recordByCarNum.entrySet().stream()
                .collect(
                        groupingBy(
                                Map.Entry::getKey,
                                flatMapping(e -> e.getValue().stream(),
                                        mapping(
                                                r -> {
                                                    if (r.getExit() == Exit.IN) {
                                                        return (-1) * r.getMins();
                                                    } else return r.getMins();
                                                },
                                                collectingAndThen(
                                                        collectingAndThen(reducing(Integer::sum), Optional::get),
                                                        accTime -> calculateFee(fees, accTime))))));

        return feeByCarNum.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .mapToInt(Map.Entry::getValue)
                .toArray();

    }

    private int calculateFee(int[] fees, int accTime) {
        int stdTime = fees[0];
        int stdFee = fees[1];
        int unitTime = fees[2];
        int unitFee = fees[3];
        double exceedTime = Math.max(accTime - stdTime, 0);

        return stdFee + (int) Math.ceil(exceedTime / unitTime) * unitFee;
    }

    private static class Record {
        private int mins;
        private String carNum;
        private Exit exit;

        public Record(String time, String carNum, String exit) {
            this.mins = parseTime(time);
            this.carNum = carNum;
            this.exit = Exit.valueOf(exit);
        }

        public static Record of(String record) {
            String[] s = record.split(" ");
            return new Record(s[0], s[1], s[2]);
        }

        public int getMins() {
            return mins;
        }

        public String getCarNum() {
            return carNum;
        }

        public Exit getExit() {
            return exit;
        }

        public int parseTime(String time) {
            int[] hourMins = Arrays.stream(time.split(":"))
                .mapToInt(Integer::parseInt).toArray();
            return hourMins[0] * 60 + hourMins[1];
        }

    }

    private enum Exit {
        IN,
        OUT
    }
}
```

[https://school.programmers.co.kr/learn/courses/30/lessons/42888](https://school.programmers.co.kr/learn/courses/30/lessons/42888)

```java
import java.util.Arrays;
import java.util.Map;

import static java.util.stream.Collectors.*;

public class Solution {
    public String[] solution(String[] record) {
        Map<String, String> nickNameByUserId = Arrays.stream(record)
                .map(r -> r.split(" "))
                .map(this::toRecord)
                .collect(
                        groupingBy(
                                Record::getUserId,
                                collectingAndThen(
                                        reducing((acc, cur) -> cur.getType() != Type.LEAVE ? cur : acc),
                                        v -> v.get().getNickName())));

        return Arrays.stream(record)
                .map(r -> r.split(" "))
                .map(rArray -> new Record(rArray[0], rArray[1], nickNameByUserId.get(rArray[1])))
                .filter(r -> r.getType() != Type.CHANGE)
                .map(Record::result)
                .toArray(String[]::new);
    }

    private Record toRecord(String[] rArray) {
        if (rArray.length == 3) {
            return new Record(rArray[0], rArray[1], rArray[2]);
        } else {
            return new Record(rArray[0], rArray[1]);
        }
    }

    private static class Record {
        private Type type;
        private String userId;
        private String nickName;

        public Record(String type, String userId, String nickName) {
            this.type = Type.valueOf(type.toUpperCase());
            this.userId = userId;
            this.nickName = nickName;
        }

        public Record(String type, String userId) {
            this.type = Type.valueOf(type.toUpperCase());
            this.userId = userId;
            this.nickName = "";
        }

        public Type getType() {
            return type;
        }

        public String getUserId() {
            return userId;
        }

        public String getNickName() {
            return nickName;
        }

        public String result() {
            if (type == Type.CHANGE) {
                throw new RuntimeException("FUcking");
            }

            return this.getNickName() + "님이 " + type.notice;
        }
    }

    enum Type {
        ENTER("들어왔습니다."),
        LEAVE("나갔습니다."),
        CHANGE("");

        private final String notice;

        Type(String notice) {
            this.notice = notice;
        }
    }
}
```

[https://school.programmers.co.kr/learn/courses/30/lessons/17686](https://school.programmers.co.kr/learn/courses/30/lessons/17686)

```java
import java.util.Arrays;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static java.util.Comparator.comparing;

public class Solution {
    public String[] solution(String[] files) {
        Pattern pattern = Pattern.compile("\\d+");
        return Arrays.stream(files)
                .map(file -> {
                    Matcher matcher = pattern.matcher(file);
                    matcher.find();
                    String delimiter = matcher.group();
                    String[] split = file.split(delimiter,2);
                    if (split.length != 2) {
                        return new Record(split[0], delimiter, "");
                    } else {
                        return new Record(split[0], delimiter, split[1]);
                    }

                })
                .sorted(comparing(Record::getHead, String.CASE_INSENSITIVE_ORDER)
                        .thenComparingInt(r -> Integer.parseInt(r.getNumber()))
                        .thenComparingInt(Record::getIndex))
                .map(Record::fileName)
                .toArray(String[]::new);
    }

    public static class Record {

        private static AtomicInteger curIdx = new AtomicInteger();
        private String head;
        private String number;
        private String tail;
        private int index;

        public Record(String head, String number, String tail) {
            this.index = curIdx.incrementAndGet();
            this.head = head;
            this.number = number;
            this.tail = tail;
        }

        public int getIndex() {
            return index;
        }

        public String getHead() {
            return head;
        }

        public String getNumber() {
            return number;
        }

        public String getTail() {
            return tail;
        }

        public String fileName() {
            return head + number + tail;
        }
    }
}
```

[https://school.programmers.co.kr/learn/courses/30/lessons/60057](https://school.programmers.co.kr/learn/courses/30/lessons/60057)

```java
import java.util.*;
import java.util.regex.MatchResult;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

class Solution {
    public int solution(String s) {
           return IntStream.range(1, s.length() + 1)
                .mapToObj(i -> Pattern.compile(String.format(".{1,%d}", i)))
                .map(p -> p.matcher(s))
                .map(p -> p.results().map(MatchResult::group).collect(Collectors.toList()))
                .map(this::compress)
                .mapToInt(String::length)
                .min().getAsInt();
        
    }
    
    public String compress(List<String> strings) {
        Stack<Info> infos = new Stack<>();
        infos.add(new Info(strings.get(0)));
        Info pre = null;
        Info cur = null;

        for (int i = 1; i < strings.size(); i++) {
            pre = infos.peek();
            cur = new Info(strings.get(i));

            if (pre.getName().equals(cur.getName())) {
                pre.add();
                continue;
            }

            infos.add(cur);
        }
        return infos.stream().map(Info::toCompress).collect(Collectors.joining());
    }

    public static class Info {
        private String name;
        private int cnt;

        public Info(String name) {
            this.name = name;
            this.cnt = 1;
        }

        public String getName() {
            return name;
        }

        public int getCnt() {
            return cnt;
        }

        public void add() {
            cnt++;
        }

        public String toCompress() {
            if (cnt == 1) {
                return name;
            }
            return cnt + name;
        }
    }
}
``` 